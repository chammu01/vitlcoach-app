# VITL App TODO

## Core App (Completed)
- [x] 4-step onboarding flow (goal, activity, weight, profile)
- [x] Dashboard screen with live vitals, workout checklist, nutrition macros, AI coach insight
- [x] AI Chat screen with simulated responses and quick-reply chips
- [x] Wearable Sync screen with device toggles and live data feed
- [x] Notifications screen with smart alerts and reminder toggles
- [x] Progress screen with weight chart, body composition, muscle map, achievements
- [x] Bottom navigation bar

## Stripe Subscription Integration
- [x] Add stripe_customer_id and stripe_subscription_id columns to users table in drizzle/schema.ts
- [x] Run pnpm db:push to migrate schema
- [x] Create server/products.ts with VITL subscription plan definitions (Basic, Pro, Elite)
- [x] Create POST /api/stripe/webhook endpoint with raw body parsing and signature verification
- [x] Create stripe.createCheckoutSession tRPC procedure (protectedProcedure)
- [x] Create stripe.createPortalSession tRPC procedure (protectedProcedure)
- [x] Create stripe.getSubscription tRPC procedure to fetch current plan status
- [x] Build PricingScreen component with 3 plan cards (Basic $9/mo, Pro $19/mo, Elite $39/mo)
- [x] Add Pricing nav item to BottomNav (💳 PLANS)
- [x] Wire PricingScreen Subscribe buttons to checkout session mutation
- [x] Add success/cancel redirect pages (handled via URL params on return)
- [x] Write vitest tests for Stripe webhook handler (8 tests, all passing)

## Feature Enhancements
- [x] Add trial_period_days: 7 to stripe.checkout.sessions.create() in server/routers.ts
- [x] Build useSubscription hook to expose plan/status to frontend components
- [x] Add "Upgrade to Pro" paywall prompt in DashboardScreen for locked features
- [x] Add "Upgrade to Pro" paywall prompt in ChatScreen for unlimited AI coaching (free limit: 3 messages/session)
- [x] Add glowing PRO/ELITE subscription badge pill next to avatar in DashboardScreen header
- [x] All 8 vitest tests passing (free trial is a server-side param, no new test needed)
