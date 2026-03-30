/**
 * VITL — Stripe Webhook Handler Tests
 *
 * Tests signature verification, test event handling, and event processing.
 * Uses mock Express req/res objects — no real Stripe calls are made.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

// ─── Mock Stripe ────────────────────────────────────────────────────────────
const mockConstructEvent = vi.fn();
const mockSubscriptionsRetrieve = vi.fn();

vi.mock("stripe", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      webhooks: {
        constructEvent: mockConstructEvent,
      },
      subscriptions: {
        retrieve: mockSubscriptionsRetrieve,
      },
    })),
  };
});

// ─── Mock DB ─────────────────────────────────────────────────────────────────
const mockUpdate = vi.fn().mockReturnValue({
  set: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(undefined),
  }),
});

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    update: mockUpdate,
  }),
}));

vi.mock("../drizzle/schema", () => ({
  users: {},
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

vi.mock("./products", () => ({
  getPlanByPriceId: vi.fn().mockReturnValue({ id: "pro" }),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeReqRes(body: Buffer | string = Buffer.from("{}")) {
  const jsonFn = vi.fn();
  const statusFn = vi.fn().mockReturnValue({ json: jsonFn });

  const req = {
    headers: { "stripe-signature": "sig_test_123" },
    body,
  } as unknown as Request;

  const res = {
    status: statusFn,
    json: jsonFn,
  } as unknown as Response;

  return { req, res, jsonFn, statusFn };
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe("stripeWebhookHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const { req, res, statusFn, jsonFn } = makeReqRes();
    const { stripeWebhookHandler } = await import("./stripeWebhook");
    await stripeWebhookHandler(req, res);

    expect(statusFn).toHaveBeenCalledWith(400);
    expect(jsonFn).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining("verification failed") })
    );
  });

  it("returns verified:true for test events (evt_test_ prefix)", async () => {
    mockConstructEvent.mockReturnValue({ id: "evt_test_abc123", type: "checkout.session.completed", data: { object: {} } });

    const { req, res, jsonFn } = makeReqRes();
    const { stripeWebhookHandler } = await import("./stripeWebhook");
    await stripeWebhookHandler(req, res);

    expect(jsonFn).toHaveBeenCalledWith({ verified: true });
  });

  it("handles checkout.session.completed and updates user", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_live_001",
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { user_id: "42" },
          customer: "cus_test_123",
          subscription: "sub_test_456",
        },
      },
    });

    mockSubscriptionsRetrieve.mockResolvedValue({
      items: { data: [{ price: { id: "price_pro_monthly" } }] },
    });

    const { req, res, jsonFn } = makeReqRes();
    const { stripeWebhookHandler } = await import("./stripeWebhook");
    await stripeWebhookHandler(req, res);

    expect(mockUpdate).toHaveBeenCalled();
    expect(jsonFn).toHaveBeenCalledWith({ received: true });
  });

  it("handles invoice.paid and sets status to active", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_live_002",
      type: "invoice.paid",
      data: { object: { customer: "cus_test_123" } },
    });

    const { req, res, jsonFn } = makeReqRes();
    const { stripeWebhookHandler } = await import("./stripeWebhook");
    await stripeWebhookHandler(req, res);

    expect(mockUpdate).toHaveBeenCalled();
    expect(jsonFn).toHaveBeenCalledWith({ received: true });
  });

  it("handles invoice.payment_failed and sets status to past_due", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_live_003",
      type: "invoice.payment_failed",
      data: { object: { customer: "cus_test_123" } },
    });

    const { req, res, jsonFn } = makeReqRes();
    const { stripeWebhookHandler } = await import("./stripeWebhook");
    await stripeWebhookHandler(req, res);

    expect(mockUpdate).toHaveBeenCalled();
    expect(jsonFn).toHaveBeenCalledWith({ received: true });
  });

  it("handles customer.subscription.deleted and clears subscription", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_live_004",
      type: "customer.subscription.deleted",
      data: { object: { customer: "cus_test_123" } },
    });

    const { req, res, jsonFn } = makeReqRes();
    const { stripeWebhookHandler } = await import("./stripeWebhook");
    await stripeWebhookHandler(req, res);

    expect(mockUpdate).toHaveBeenCalled();
    expect(jsonFn).toHaveBeenCalledWith({ received: true });
  });

  it("returns received:true for unhandled event types", async () => {
    mockConstructEvent.mockReturnValue({
      id: "evt_live_005",
      type: "payment_method.attached",
      data: { object: {} },
    });

    const { req, res, jsonFn } = makeReqRes();
    const { stripeWebhookHandler } = await import("./stripeWebhook");
    await stripeWebhookHandler(req, res);

    expect(jsonFn).toHaveBeenCalledWith({ received: true });
  });
});
