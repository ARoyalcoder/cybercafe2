import crypto from "crypto";
import { Subscription }
    from "../models/subscription.model.js";
import razorpay from
    "../config/razorpay.js";
import { Payment } from "../models/payment.model.js";

const PLAN_PRICES = {

    plus: 15,
    prime: 35,
    pro: 99,
};

export const createOrder = async (
    req: any,
    res: any
) => {
    try {
        const { plan } = req.body;

        const amount =
            PLAN_PRICES[
            plan as keyof typeof PLAN_PRICES
            ];

        if (!amount) {
            return res.status(400).json({
                message: "Invalid plan",
            });
        }

        const order =
            await razorpay.orders.create({
                amount: amount * 100,
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            });

        return res.status(200).json(order);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to create order",
        });
    }
};



export const verifyPayment = async (
    req: any,
    res: any
) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            plan,
        } = req.body;

        console.log({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            plan,
        });
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !plan
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields",
            });
        }
        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_SECRET!
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");

        if (
            generatedSignature !==
            razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment signature",
            });
        }

        const amount =
            PLAN_PRICES[
            plan as keyof typeof PLAN_PRICES
            ];

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan",
            });
        }
        await Subscription.findOneAndUpdate(
            {
                user: req.user._id,
            },
            {
                plan,
                status: "active",
            },
            {
               returnDocument: "after",
            }
        );

        await Payment.create({
            user: req.user._id,

            amount,

            plan,

            paymentId:
                razorpay_payment_id,

            orderId:
                razorpay_order_id,

            status: "success",
        });
        const expiryDate = new Date();

        expiryDate.setMonth(
            expiryDate.getMonth() + 1
        );

        await Subscription.findOneAndUpdate(
            {
                user: req.user._id,
            },
            {
                plan,
                status: "active",
                expiresAt: expiryDate,
            }
        );
        return res.status(200).json({
            success: true,
            message:
                "Subscription upgraded successfully",
        });
    } catch (error) {
        console.error(
            "Verify Payment Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error",
        });
    }
};



export const paymentHistory =
    async (
        req: any,
        res: any
    ) => {
        const payments =
            await Payment.find({
                user: req.user._id,
            })
                .sort({
                    createdAt: -1,
                });

        return res.json({
            success: true,
            payments,
        });
    };