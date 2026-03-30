/**
 * VITL — Stripe Webhook Handler
 *
 * Registered at POST /api/stripe/webhook with express.raw() BEFORE express.json()
 * so the raw body is available for Stripe signature verification.
 *
 * Events handled:
 *  - checkout.session.completed  → save customer + subscription IDs
 *  - invoice.paid                → keep subscription active
 *  - invoice.payment_failed      → mark subscription as past_due
 *  - customer.subscription.deleted → clear subscription
 */
import type { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { getPlanByPriceId } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-03-25.dahlia",
});

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig as string,
      webhookSecret
    );
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  // ⚠️ Test events must return verified:true for the Stripe dashboard check
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  const db = await getDb();
  if (!db) {
    console.warn("[Webhook] Database not available, skipping event processing");
    return res.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId) {
          console.warn("[Webhook] checkout.session.completed: missing user_id in metadata");
          break;
        }

        // Fetch the subscription to get the price/plan
        let planId = "basic";
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = sub.items.data[0]?.price?.id;
          if (priceId) {
            const plan = getPlanByPriceId(priceId);
            if (plan) planId = plan.id;
          }
        }

        await db.update(users)
          .set({
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionPlan: planId,
            subscriptionStatus: "active",
          })
          .where(eq(users.id, parseInt(userId)));

        console.log(`[Webhook] Subscription activated for user ${userId}: plan=${planId}`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await db.update(users)
          .set({ subscriptionStatus: "active" })
          .where(eq(users.stripeCustomerId, customerId));

        console.log(`[Webhook] Invoice paid for customer ${customerId}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await db.update(users)
          .set({ subscriptionStatus: "past_due" })
          .where(eq(users.stripeCustomerId, customerId));

        console.log(`[Webhook] Payment failed for customer ${customerId}`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        await db.update(users)
          .set({
            stripeSubscriptionId: null,
            subscriptionPlan: null,
            subscriptionStatus: "canceled",
          })
          .where(eq(users.stripeCustomerId, customerId));

        console.log(`[Webhook] Subscription canceled for customer ${customerId}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[Webhook] Error processing event:", err);
    return res.status(500).json({ error: "Internal error processing webhook" });
  }

  return res.json({ received: true });
}
