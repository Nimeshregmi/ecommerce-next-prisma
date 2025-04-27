/**
 * This file contains the configuration and utility functions for Stripe integration
 * To use this integration, you'll need to:
 * 1. Create a Stripe account: https://stripe.com/
 * 2. Install Stripe dependencies: npm install stripe @stripe/stripe-js
 * 3. Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to your .env file
 */

// This code imports the Stripe SDK if available. If not installed, it uses mock functionality.
let Stripe: any;
try {
  // Try to import the real Stripe SDK
  Stripe = require("stripe");
} catch (error) {
  // Mock implementation if Stripe SDK is not installed
  console.warn("Stripe SDK not found. Using mock implementation for development.");
  Stripe = class MockStripe {
    constructor() {
      console.log("Using Mock Stripe implementation");
    }
    
    checkout = {
      sessions: {
        create: async () => ({ 
          id: "mock_session_" + Math.random().toString(36).substring(2, 9),
          url: "#mock-checkout-url"
        }),
      },
    }
    
    paymentIntents = {
      create: async () => ({ 
        id: "mock_payment_" + Math.random().toString(36).substring(2, 9),
        client_secret: "mock_secret_" + Math.random().toString(36).substring(2, 15)
      }),
    }
  };
}

// Initialize Stripe with secret key from environment variables or use mock key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "mock_key_for_development");

// Currency formatting options
const currencyOptions: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

// Convert amount for Stripe (Stripe requires amounts in smallest currency unit, e.g., cents)
export const formatAmountForStripe = (amount: number) => {
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    currencyDisplay: "symbol",
  });
  
  // INR doesn't have subunits like cents, so no need to multiply by 100
  return Math.round(amount);
};

// Format display amount for frontend display
export const formatAmountForDisplay = (amount: number) => {
  const formatter = new Intl.NumberFormat("en-IN", currencyOptions);
  return formatter.format(amount);
};

// Create a new Stripe checkout session
export async function createCheckoutSession({
  items,
  successUrl,
  cancelUrl,
  metadata,
  customerEmail,
}: {
  items: Array<{ price: number; quantity: number; name: string; id: string }>;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  customerEmail?: string;
}) {
  // Create line items for checkout
  const lineItems = items.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        metadata: {
          productId: item.id,
        },
      },
      unit_amount: formatAmountForStripe(item.price),
    },
    quantity: item.quantity,
  }));

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    customer_email: customerEmail,
  });

  return session;
}

// Create a payment intent for custom checkout flow
export async function createPaymentIntent({
  amount,
  metadata,
  customerEmail,
}: {
  amount: number;
  metadata?: Record<string, string>;
  customerEmail?: string;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(amount),
    currency: "inr",
    metadata,
    receipt_email: customerEmail,
    payment_method_types: ["card"],
  });

  return paymentIntent;
}

export default stripe;