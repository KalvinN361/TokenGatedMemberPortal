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
exports.emailRoute = void 0;
const express_1 = require("express");
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.REACT_APP_RESEND_KEY);
exports.emailRoute = (0, express_1.Router)();
exports.emailRoute.post('/Email/StripePaymentSuccess', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    console.log(email);
    try {
        let data = yield resend.emails.send({
            from: 'Project Venkman <project@venkmanholdings.com>',
            to: [`${email}`],
            subject: 'Hello World',
            html: '<strong>It works!</strong>',
        });
        console.log(data);
        res.status(200).json({
            status: 'success',
            code: 200,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
