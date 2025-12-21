import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize Stripe
// IMPORTANT: Set your Stripe secret key and webhook secret in your Firebase environment variables.
// firebase functions:config:set stripe.secret="sk_test_..."
// firebase functions:config:set stripe.webhook_secret="whsec_..."
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
  };

  await db.collection("users").doc(uid).set(userProfile);
  await admin.auth().setCustomUserClaims(uid, { role: "client" });
});

// --- 2. Admin API ---

export const makeAdmin = functions.https.onCall(async (data, context) => {
  if (context.auth?.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can promote users.");
  }

  const { targetUserId } = data;
  await admin.auth().setCustomUserClaims(targetUserId, { role: "admin" });
  await db.collection("users").doc(targetUserId).update({ role: "admin" });

  return { success: true, message: `User ${targetUserId} is now an admin.` };
});

// --- 3. Stripe Integration ---

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  }

  const { product, buildConfiguration } = data;
  const uid = context.auth.uid;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price * 100, // Price in cents
        },
        quantity: 1,
      }],
      client_reference_id: uid,
      metadata: {
        buildConfiguration: JSON.stringify(buildConfiguration), // Store config as a string
      },
      // IMPORTANT: Replace with your actual frontend URLs
      success_url: `http://localhost:5173/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/`,
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error("Stripe session creation failed:", error);
    throw new functions.https.HttpsError("internal", "Could not create Stripe checkout session.");
  }
});

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

    const clientId = session.client_reference_id;
    const buildConfigurationString = session.metadata?.buildConfiguration;

    if (!clientId || !buildConfigurationString) {
      console.error("Webhook received without clientId or buildConfiguration.");
      res.status(400).send("Missing required metadata.");
      return;
    }
    
    const buildConfiguration = JSON.parse(buildConfigurationString);

    // Create the order in Firestore
    const orderDetails = {
      clientId,
      buildConfiguration,
      stripeSessionId: session.id,
      paymentStatus: session.payment_status,
      status: "pending_approval", // Initial status for admin review
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("clientOrders").add(orderDetails);
    console.log(`Successfully created order for client: ${clientId}`);
  }

  res.status(200).json({ received: true });
});
