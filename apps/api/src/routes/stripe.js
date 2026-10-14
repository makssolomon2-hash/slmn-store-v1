import express from 'express';
import Stripe from 'stripe';
import logger from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /stripe/create-checkout
// Create a Stripe Checkout Session
router.post('/create-checkout', async (req, res) => {
  const { items, successUrl, cancelUrl } = req.body;

  // Validate required fields
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required and must not be empty' });
  }

  if (!successUrl || !cancelUrl) {
    return res.status(400).json({ error: 'successUrl and cancelUrl are required' });
  }

  // Validate each item
  for (const item of items) {
    if (!item.productName || !item.price) {
      return res.status(400).json({ error: 'Each item must have productName and price' });
    }
  }

  // Build line items for Stripe
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.productName,
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: 1,
  }));

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  logger.info(`Checkout session created: ${session.id}`);

  res.json({ url: session.url });
});

// GET /stripe/session/:sessionId
// Retrieve a Checkout Session
router.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  // Retrieve session with line_items expanded
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });

  // Map line items to response format
  const items = (session.line_items?.data || []).map((item) => ({
    name: item.description,
    amount: item.amount_total,
  }));

  logger.info(`Session retrieved: ${session.id}, status: ${session.payment_status}`);

  res.json({
    id: session.id,
    status: session.payment_status,
    amountTotal: session.amount_total,
    customerEmail: session.customer_details?.email,
    items,
  });
});

export default router;
