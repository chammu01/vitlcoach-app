/**
 * VITL — useSubscription hook
 * Fetches the current user's Stripe subscription plan and status.
 * Returns helpers for feature gating across the app.
 */
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export type PlanId = "basic" | "pro" | "elite" | null;

export interface SubscriptionState {
  plan: PlanId;
  status: string | null;
  isActive: boolean;
  isPro: boolean;
  isElite: boolean;
  isLoading: boolean;
}

export function useSubscription(): SubscriptionState {
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = trpc.stripe.subscription.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000, // cache for 1 minute
  });

  const plan = (data?.plan ?? null) as PlanId;
  const status = data?.status ?? null;
  const isActive = status === "active" || status === "trialing";

  return {
    plan,
    status,
    isActive,
    isPro: isActive && (plan === "pro" || plan === "elite"),
    isElite: isActive && plan === "elite",
    isLoading: isAuthenticated ? isLoading : false,
  };
}
