import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import Stripe from "stripe";
import { z } from "zod";
import { VITL_PLANS } from "./products";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-03-25.dahlia",
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  stripe: router({
    /** Return the list of available plans (safe to call without auth) */
    plans: publicProcedure.query(() => {
      return VITL_PLANS.map(p => ({
        id: p.id,
        name: p.name,
        priceLabel: p.priceLabel,
        features: p.features,
        highlight: p.highlight,
        available: !!p.stripePriceId,
      }));
    }),

    /** Return the current user's subscription status */
    subscription: protectedProcedure.query(async ({ ctx }) => {
      return {
        plan: ctx.user.subscriptionPlan ?? null,
        status: ctx.user.subscriptionStatus ?? null,
        customerId: ctx.user.stripeCustomerId ?? null,
      };
    }),

    /** Create a Stripe Checkout Session and return the URL */
    createCheckoutSession: protectedProcedure
      .input(z.object({ planId: z.enum(["basic", "pro", "elite"]) }))
      .mutation(async ({ ctx, input }) => {
        const plan = VITL_PLANS.find(p => p.id === input.planId);
        if (!plan) throw new Error("Invalid plan");
        if (!plan.stripePriceId) throw new Error("Plan not yet configured in Stripe. Please add STRIPE_PRICE_* env vars.");

        const origin = ctx.req.headers.origin as string ?? "https://vitlcoach-mk3wzzhw.manus.space";

        // Re-use existing customer if available
        let customerId = ctx.user.stripeCustomerId ?? undefined;
        if (!customerId && ctx.user.email) {
          // Try to find existing customer by email
          const existing = await stripe.customers.list({ email: ctx.user.email, limit: 1 });
          if (existing.data.length > 0) {
            customerId = existing.data[0].id;
          }
        }

        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          customer: customerId,
          customer_email: !customerId ? (ctx.user.email ?? undefined) : undefined,
          line_items: [{ price: plan.stripePriceId, quantity: 1 }],
          allow_promotion_codes: true,
          subscription_data: {
            trial_period_days: 7,
            metadata: {
              user_id: ctx.user.id.toString(),
              plan_id: plan.id,
            },
          },
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email ?? "",
            customer_name: ctx.user.name ?? "",
            plan_id: plan.id,
          },
          success_url: `${origin}/?subscription=success&plan=${plan.id}`,
          cancel_url: `${origin}/?subscription=canceled`,
        });

        return { url: session.url };
      }),

    /** Create a Stripe Customer Portal session and return the URL */
    createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
      const customerId = ctx.user.stripeCustomerId;
      if (!customerId) throw new Error("No active subscription found.");

      const origin = ctx.req.headers.origin as string ?? "https://vitlcoach-mk3wzzhw.manus.space";

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: origin,
      });

      return { url: session.url };
    }),
  }),
});

export type AppRouter = typeof appRouter;
