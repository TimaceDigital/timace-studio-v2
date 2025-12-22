import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize Stripe
// To set config: firebase functions:config:set stripe.secret="sk_test_..." stripe.webhook_secret="whsec_..."
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2023-10-16",
});

// --- 1. User Creation Trigger ---
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;
  const userProfile = {
    userId: uid,
    email: email || "",
    displayName: displayName || "",
    role: "client",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    preferences: {
      emailNotifications: true,
      slackIntegration: false
    }
  };

  await db.collection("users").doc(uid).set(userProfile);
  // Set custom claims for role-based access control
  await admin.auth().setCustomUserClaims(uid, { role: "client" });
});

// --- 2. Order Management ---

// Called by the frontend BEFORE redirecting to Stripe.
// This creates the "Draft" order in Firestore so we can store large data (notes, configs) 
// that won't fit in Stripe metadata.
export const createDraftOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  }

  const { items, configurations, notes, type, contactEmail, contactName, totalValue } = data;
  const uid = context.auth.uid;

  const orderData = {
    clientId: uid,
    clientName: contactName,
    clientEmail: contactEmail,
    title: items[0]?.name || "New Project", // Use first item as title or generic
    items,
    configurations,
    notes,
    type: type || 'standard', // 'standard' or 'proposal'
    status: 'draft', // Initial status
    paymentStatus: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    totalValue: totalValue || 0,
    progress: 0,
    unreadMessagesCount: 0
  };

  const orderRef = await db.collection("orders").add(orderData);
  return { orderId: orderRef.id };
});

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  }

  const { orderId } = data; // We only pass the orderId now
  const uid = context.auth.uid;

  // Fetch the draft order to get details
  const orderDoc = await db.collection("orders").doc(orderId).get();
  if (!orderDoc.exists) {
    throw new functions.https.HttpsError("not-found", "Order not found.");
  }
  const order = orderDoc.data();
  if (!order || order.clientId !== uid) {
    throw new functions.https.HttpsError("permission-denied", "Unauthorized access to order.");
  }

  try {
    // Construct line items for Stripe
    // If it's a "Custom" price item (value 0 or undefined), we might need a fallback or different flow.
    // For now, we assume items have a valid priceValue.
    const line_items = (order.items || []).map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.category,
        },
        unit_amount: Math.round((item.priceValue || 0) * 100), // cents
      },
      quantity: 1,
    })).filter((li: any) => li.price_data.unit_amount > 0);

    // Fallback if no paid items (shouldn't happen for card flow)
    if (line_items.length === 0) {
       throw new functions.https.HttpsError("invalid-argument", "No payable items in order.");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      client_reference_id: uid,
      metadata: {
        orderId: orderId, // The KEY link
      },
      success_url: `http://localhost:5173/dashboard?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `http://localhost:5173/checkout`, // Back to checkout
    });

    return { sessionId: session.id, url: session.url };
  } catch (error: any) {
    console.error("Stripe session creation failed:", error);
    throw new functions.https.HttpsError("internal", error.message || "Could not create Stripe checkout session.");
  }
});

// --- 3. Webhooks ---

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = functions.config().stripe.webhook_secret;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      console.log(`Payment success for Order ${orderId}. Updating status.`);
      
      await db.collection("orders").doc(orderId).update({
        status: "pending_approval", // Ready for admin
        paymentStatus: "paid",
        stripeSessionId: session.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Optional: Send email confirmation via extension or generic email service
    }
  }

  res.status(200).json({ received: true });
});

// --- 4. Admin Helpers ---

export const makeAdmin = functions.https.onCall(async (data, context) => {
  // Security: Check if requester is admin (or use a secret key mechanism for first admin)
  // For dev: Allow if no admins exist or check hardcoded UID
  // const callingUid = context.auth?.uid;
  
  // if (context.auth?.token.role !== "admin") {
  //   throw new functions.https.HttpsError("permission-denied", "Only admins can promote users.");
  // }

  const { targetUserId } = data;
  await admin.auth().setCustomUserClaims(targetUserId, { role: "admin" });
  await db.collection("users").doc(targetUserId).update({ role: "admin" });

  return { success: true, message: `User ${targetUserId} is now an admin.` };
});
