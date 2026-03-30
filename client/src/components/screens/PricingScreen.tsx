/*
 * VITL — PricingScreen
 * Design: Cyberpunk Terminal Fitness
 * 3 subscription tiers with Stripe Checkout redirect
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import type { Screen } from "@/pages/Home";
import { toast } from "sonner";

interface Props {
  onNavigate: (s: Screen) => void;
}

const PLAN_COLORS: Record<string, string> = {
  basic: "var(--vitl-muted)",
  pro: "var(--vitl-accent)",
  elite: "var(--vitl-accent3)",
};

const PLAN_GLOWS: Record<string, string> = {
  basic: "rgba(255,255,255,0.04)",
  pro: "rgba(200,255,87,0.06)",
  elite: "rgba(255,87,135,0.06)",
};

export default function PricingScreen({ onNavigate }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: plans, isLoading: plansLoading } = trpc.stripe.plans.useQuery();
  const { data: subscription } = trpc.stripe.subscription.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const checkoutMutation = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) {
        window.open(url, "_blank");
        toast.success("Redirecting to Stripe Checkout…");
      }
      setLoadingPlan(null);
    },
    onError: (err) => {
      toast.error(err.message);
      setLoadingPlan(null);
    },
  });

  const portalMutation = trpc.stripe.createPortalSession.useMutation({
    onSuccess: ({ url }) => {
      window.open(url, "_blank");
      toast.success("Opening billing portal…");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleSubscribe(planId: "basic" | "pro" | "elite") {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setLoadingPlan(planId);
    checkoutMutation.mutate({ planId });
  }

  const currentPlan = subscription?.plan;
  const isActive = subscription?.status === "active";

  return (
    <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 4 }}>Membership</div>
        <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>Choose Your Plan</div>
        <div style={{ fontSize: 11, color: "var(--vitl-muted)", marginTop: 4 }}>
          Unlock your full potential with VITL AI
        </div>
      </div>

      <div className="scrollable" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Active subscription banner */}
        {isActive && currentPlan && (
          <div style={{
            background: "rgba(200,255,87,0.06)",
            border: "1px solid rgba(200,255,87,0.2)",
            borderRadius: 14,
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--vitl-muted)" }}>Active Plan</div>
              <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 14, fontWeight: 700, color: "var(--vitl-accent)", textTransform: "capitalize" }}>
                VITL {currentPlan}
              </div>
            </div>
            <button
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
              style={{
                background: "rgba(200,255,87,0.1)",
                border: "1px solid rgba(200,255,87,0.2)",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: 11,
                color: "var(--vitl-accent)",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {portalMutation.isPending ? "Opening…" : "Manage Billing →"}
            </button>
          </div>
        )}

        {/* Plan cards */}
        {plansLoading ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--vitl-muted)", fontSize: 12 }}>
            Loading plans…
          </div>
        ) : (
          plans?.map(plan => {
            const color = PLAN_COLORS[plan.id];
            const glow = PLAN_GLOWS[plan.id];
            const isCurrent = currentPlan === plan.id && isActive;
            const isLoading = loadingPlan === plan.id;

            return (
              <div
                key={plan.id}
                style={{
                  background: plan.highlight ? glow : "var(--vitl-surface)",
                  border: `1px solid ${plan.highlight ? color + "33" : "var(--vitl-border)"}`,
                  borderRadius: 18,
                  padding: 20,
                  position: "relative",
                  transition: "all 0.2s",
                }}
              >
                {/* Popular badge */}
                {plan.highlight && (
                  <div style={{
                    position: "absolute",
                    top: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--vitl-accent)",
                    color: "#000",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontFamily: "'DM Mono', monospace",
                    whiteSpace: "nowrap",
                  }}>
                    Most Popular
                  </div>
                )}

                {/* Plan header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--vitl-muted)", marginBottom: 4 }}>
                      VITL
                    </div>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 18, fontWeight: 700, color }}>
                      {plan.name}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>
                      {plan.priceLabel}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--vitl-muted)", marginTop: 2 }}>/month</div>
                  </div>
                </div>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: color + "22", border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4L3 6L7 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.75)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <div style={{
                    textAlign: "center",
                    padding: "12px",
                    borderRadius: 12,
                    background: color + "11",
                    border: `1px solid ${color}33`,
                    fontSize: 12,
                    color,
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    ✓ Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id as "basic" | "pro" | "elite")}
                    disabled={isLoading || checkoutMutation.isPending}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: 12,
                      border: "none",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      transition: "all 0.2s",
                      background: plan.highlight
                        ? "var(--vitl-accent)"
                        : color + "22",
                      color: plan.highlight ? "#000" : color,
                      opacity: isLoading ? 0.7 : 1,
                    }}
                  >
                    {isLoading ? "Redirecting…" : !plan.available ? "Coming Soon" : isAuthenticated ? `Subscribe to ${plan.name} →` : "Sign in to Subscribe →"}
                  </button>
                )}
              </div>
            );
          })
        )}

        {/* Test mode notice */}
        <div style={{
          background: "rgba(255,159,87,0.06)",
          border: "1px solid rgba(255,159,87,0.15)",
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: 11,
          color: "var(--vitl-accent4)",
        }}>
          <strong>Test mode:</strong> Use card <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4 }}>4242 4242 4242 4242</code> with any future date and CVC.
        </div>

        {/* FAQ */}
        <div style={{ paddingBottom: 8 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 12 }}>FAQ</div>
          {[
            ["Can I cancel anytime?", "Yes — cancel instantly from the billing portal. No questions asked."],
            ["Is there a free trial?", "All plans include a 7-day free trial. No charge until day 8."],
            ["Can I upgrade or downgrade?", "Yes — changes take effect at the next billing cycle."],
          ].map(([q, a]) => (
            <div key={q} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{q}</div>
              <div style={{ fontSize: 11, color: "var(--vitl-muted)", lineHeight: 1.5 }}>{a}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
