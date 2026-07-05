import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/stripe-checkout', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.success_url.split('orderId=')[1];
      
      await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: 'completed', orderStatus: 'processing' },
        { new: true }
      );
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/upi-payment', verifyToken, async (req, res) => {
  try {
    const { orderId, upiId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'completed';
    order.orderStatus = 'processing';
    await order.save();

    res.json({ message: 'Payment initiated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ 
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
