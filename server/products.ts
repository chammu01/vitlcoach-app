/**
 * VITL — Subscription Plan Definitions
 *
 * These are the three VITL subscription tiers. Price IDs are read from
 * environment variables so they can differ between test and live mode.
 *
 * To set up in Stripe Dashboard (test mode):
 *  1. Create three products: VITL Basic, VITL Pro, VITL Elite
 *  2. Add a monthly recurring price to each
 *  3. Set the env vars below in Settings → Secrets
 */

export interface VitlPlan {
  id: "basic" | "pro" | "elite";
  name: string;
  price: number;          // USD cents per month
  priceLabel: string;     // display string
  stripePriceId: string;  // Stripe Price ID (env-driven)
  features: string[];
  highlight: boolean;
}

export const VITL_PLANS: VitlPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 900,
    priceLabel: "$9",
    stripePriceId: process.env.STRIPE_PRICE_BASIC ?? "",
    features: [
      "AI Coach (5 msgs/day)",
      "Workout tracking",
      "Macro logging",
      "7-day progress chart",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 1900,
    priceLabel: "$19",
    stripePriceId: process.env.STRIPE_PRICE_PRO ?? "",
    features: [
      "Unlimited AI Coach",
      "Custom workout plans",
      "Full nutrition analytics",
      "90-day progress chart",
      "Wearable sync",
    ],
    highlight: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 3900,
    priceLabel: "$39",
    stripePriceId: process.env.STRIPE_PRICE_ELITE ?? "",
    features: [
      "Everything in Pro",
      "1-on-1 AI form analysis",
      "Blood marker tracking",
      "Priority support",
      "Early feature access",
    ],
    highlight: false,
  },
];

export function getPlanById(id: string): VitlPlan | undefined {
  return VITL_PLANS.find(p => p.id === id);
}

export function getPlanByPriceId(priceId: string): VitlPlan | undefined {
  return VITL_PLANS.find(p => p.stripePriceId === priceId);
}
