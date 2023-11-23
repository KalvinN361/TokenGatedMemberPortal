import { NextFunction, Request, Response, Router } from 'express';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const stripeRoute = Router();
stripeRoute.post(
    '/stripe/createPayment',
    async (req: Request, res: Response, next: NextFunction) => {
        const { amount } = req.body;

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
            });
            res.send({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            console.error('Error creating PaymentIntent:', error);
            res.status(500).send({ error: 'Payment Intent creation failed' });
        }
    }
);
