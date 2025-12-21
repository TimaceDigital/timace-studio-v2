"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.createCheckoutSession = exports.makeAdmin = exports.onUserCreate = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
// --- 1. User Creation Trigger ---
// When a new user is created in Auth, create a User Document and set default Role
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName } = user;
    const userProfile = {
        userId: uid,
        email: email || "",
        displayName: displayName || "",
        role: "client",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection("users").doc(uid).set(userProfile);
    // Set custom claims for role-based access control
    await admin.auth().setCustomUserClaims(uid, { role: "client" });
});
// --- 2. Admin API ---
// Example: Function to make a user an admin (this should be protected or run manually)
exports.makeAdmin = functions.https.onCall(async (data, context) => {
    var _a;
    // Check if the requester is already an admin
    if (((_a = context.auth) === null || _a === void 0 ? void 0 : _a.token.role) !== "admin") {
        // For initial setup, you might want to bypass this check or use a secret key
        // throw new functions.https.HttpsError("permission-denied", "Only admins can promote users.");
    }
    const { targetUserId } = data;
    await admin.auth().setCustomUserClaims(targetUserId, { role: "admin" });
    await db.collection("users").doc(targetUserId).update({ role: "admin" });
    return { success: true, message: `User ${targetUserId} is now an admin.` };
});
// --- 3. Stripe Integration (Placeholder) ---
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
    }
    // const { productId, priceId } = data;
    // Logic to create Stripe Session would go here
    // const session = await stripe.checkout.sessions.create({ ... });
    return { sessionId: "mock-session-id", url: "https://stripe.com/mock-checkout" };
});
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    // const sig = req.headers["stripe-signature"];
    // Verify webhook signature and handle events
    // if (event.type === 'checkout.session.completed') { ... }
    res.status(200).send({ received: true });
});
//# sourceMappingURL=index.js.map