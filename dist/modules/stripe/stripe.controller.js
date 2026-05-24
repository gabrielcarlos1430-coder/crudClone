"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createCheckoutSession = void 0;
const stripe_service_1 = require("./stripe.service");
const prisma_1 = __importDefault(require("../../database/prisma"));
// 💰 CRIAR CHECKOUT
const createCheckoutSession = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({
                error: "Usuário não autenticado",
            });
        }
        const session = await stripe_service_1.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "brl",
                        product_data: {
                            name: "Plano PRO",
                        },
                        unit_amount: 1990,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONT_URL}/success`,
            cancel_url: `${process.env.FRONT_URL}/cancel`,
            metadata: {
                userId: String(user.id),
            },
        });
        return res.json({ url: session.url });
    }
    catch (error) {
        console.error("❌ Erro ao criar checkout:", error);
        return res.status(500).json({
            error: "Erro ao criar sessão de pagamento",
        });
    }
};
exports.createCheckoutSession = createCheckoutSession;
// 🔥 WEBHOOK (VERSÃO COMPATÍVEL COM QUALQUER STRIPE)
const handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event; // 🔥 resolve erro de tipagem
    try {
        event = stripe_service_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error("❌ Webhook inválido:", err);
        return res.status(400).send(`Webhook Error`);
    }
    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object; // 🔥 evita erro de tipo
            const userId = Number(session.metadata?.userId);
            if (!userId) {
                console.error("❌ userId não encontrado no metadata");
                return res.json({ received: true });
            }
            await prisma_1.default.user.update({
                where: { id: userId },
                data: {
                    plan: "PRO",
                },
            });
            console.log("💰 Usuário virou PRO:", userId);
        }
        return res.json({ received: true });
    }
    catch (error) {
        console.error("❌ Erro no webhook:", error);
        return res.status(500).json({
            error: "Erro interno no webhook",
        });
    }
};
exports.handleWebhook = handleWebhook;
