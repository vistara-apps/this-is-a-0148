import { loadStripe } from '@stripe/stripe-js';
import { PricingTier } from '../types';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key';
const stripePromise = loadStripe(stripePublishableKey);

export interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata: {
    tierId: string;
    logoId: string;
    userId: string;
  };
}

export async function createPaymentIntent(paymentData: PaymentIntentData) {
  try {
    // In a real application, this would call your backend API
    // which would create the payment intent with Stripe
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function processPayment(
  tierId: string,
  logoId: string,
  userId: string,
  tier: PricingTier
) {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Create payment intent
    const clientSecret = await createPaymentIntent({
      amount: tier.price * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        tierId,
        logoId,
        userId,
      },
    });

    // For demo purposes, we'll simulate a successful payment
    // In production, you would redirect to Stripe Checkout or use Elements
    console.log('Processing payment for:', {
      tier: tier.name,
      amount: tier.price,
      logoId,
      userId,
    });

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      paymentIntentId: `pi_demo_${Date.now()}`,
      clientSecret,
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
}

export async function redirectToCheckout(
  tierId: string,
  logoId: string,
  userId: string,
  tier: PricingTier
) {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // In a real application, you would create a checkout session on your backend
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tierId,
        logoId,
        userId,
        priceId: tier.id, // This would be the Stripe Price ID
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Checkout redirect error:', error);
    throw error;
  }
}

export async function verifyPayment(sessionId: string) {
  try {
    const response = await fetch(`/api/verify-payment/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    const paymentData = await response.json();
    return paymentData;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
}
