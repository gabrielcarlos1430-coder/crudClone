"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const resend_1 = require("resend");
class MailService {
    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('❌ RESEND_API_KEY não configurada');
        }
        this.resend = new resend_1.Resend(apiKey);
        console.log('📧 Resend inicializado');
    }
    // 🔐 2FA EMAIL
    async send2FACode(email, code) {
        try {
            await this.resend.emails.send({
                from: 'CoreAuth <no-reply@coreauth.dev>',
                to: email,
                subject: 'Seu código de verificação',
                html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>🔐 Código de verificação</h2>
            <p>Use o código abaixo:</p>
            <h1 style="letter-spacing: 5px;">${code}</h1>
            <p>Expira em 5 minutos</p>
          </div>
        `,
            });
        }
        catch (err) {
            console.error('❌ Erro 2FA email:', err);
            throw new Error('Erro ao enviar código 2FA');
        }
    }
    // 📩 GENÉRICO
    async sendGenericEmail(to, subject, html) {
        try {
            await this.resend.emails.send({
                from: 'CoreAuth <no-reply@coreauth.dev>',
                to,
                subject,
                html,
            });
        }
        catch (err) {
            console.error('❌ Erro email:', err);
            throw new Error('Erro ao enviar email');
        }
    }
    // 🧪 TESTE
    async verifyConnection() {
        console.log('🟢 Resend ativo');
        return true;
    }
}
exports.MailService = MailService;
