"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeRoute = void 0;
const express_1 = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.stripeRoute = (0, express_1.Router)();
exports.stripeRoute.post('/stripe/createPayment', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error('Error creating PaymentIntent:', error);
        res.status(500).send({ error: 'Payment Intent creation failed' });
    }
}));
