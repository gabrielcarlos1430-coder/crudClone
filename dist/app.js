"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const audit_routes_1 = __importDefault(require("./modules/audit/audit.routes"));
const security_routes_1 = __importDefault(require("./modules/security/security.routes"));
const stripe_routes_1 = __importDefault(require("./modules/stripe/stripe.routes"));
const numbers_routes_1 = __importDefault(require("./modules/numbers/numbers.routes"));
// 🔥 ANALYTICS
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
// 🎰 GENERATOR
const generator_routes_1 = __importDefault(require("./modules/generator/generator.routes"));
// 🎯 SIMULATOR
const simulator_routes_1 = __importDefault(require("./modules/simulator/simulator.routes"));
// 🧠 STRATEGY ENGINE
const strategy_routes_1 = __importDefault(require("./modules/strategy-engine/strategy.routes"));
// 🤖 DECISION ENGINE
const decision_routes_1 = __importDefault(require("./modules/decision-engine/decision.routes"));
// 🧬 AUTO LEARNING
const learning_routes_1 = __importDefault(require("./modules/auto-learning/learning.routes"));
// 🧠 AI ORCHESTRATOR
const orchestrator_routes_1 = __importDefault(require("./modules/ai-orchestrator/orchestrator.routes"));
// ⚽ FOOTBALL
const football_routes_1 = __importDefault(require("./modules/football/football.routes"));
// 🧠 LOAD STRATEGIES
require("./modules/strategy-engine/strategies");
const swagger_1 = require("./shared/config/swagger");
const error_middleware_1 = require("./shared/middlewares/error.middleware");
const audit_middleware_1 = require("./shared/middlewares/audit.middleware");
const block_middleware_1 = require("./shared/middlewares/block.middleware");
const app = (0, express_1.default)();
// 🔥 ESSENCIAL PARA RAILWAY
app.set('trust proxy', 1);
// ==========================================
// 🔥 STRIPE WEBHOOK (ANTES DE TUDO)
// ==========================================
app.use('/api/v1/stripe/webhook', express_1.default.raw({ type: 'application/json' }));
// 🔧 CORE
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 🌐 CORS
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
// 🛡️ SEGURANÇA
app.use((0, helmet_1.default)());
// 📊 LOGS
app.use((0, morgan_1.default)('dev'));
// 🚧 BLOQUEIO GLOBAL
app.use(block_middleware_1.blockMiddleware);
// 🏠 ROOT
app.get('/', (req, res) => {
    res.send('API rodando 🚀');
});
// 📘 SWAGGER
(0, swagger_1.swaggerSetup)(app);
// ==========================================
// 🛣 ROTAS
// ==========================================
const routes = express_1.default.Router();
// 👤 USERS
routes.use('/users', user_routes_1.default);
// 🔐 AUTH
routes.use('/auth', auth_routes_1.default);
// 📊 AUDITORIA
routes.use('/audit-logs', audit_routes_1.default);
// 🛡️ SECURITY
routes.use('/security', security_routes_1.default);
// 💳 STRIPE
routes.use('/stripe', stripe_routes_1.default);
// 🎲 NÚMEROS
routes.use('/numbers', numbers_routes_1.default);
// 🧠 ANALYTICS
routes.use('/analytics', analytics_routes_1.default);
// 🎰 GENERATOR
routes.use('/generator', generator_routes_1.default);
// 🎯 SIMULATOR
routes.use('/simulator', simulator_routes_1.default);
// 🧠 STRATEGIES
routes.use('/strategy', strategy_routes_1.default);
// 🤖 DECISION ENGINE
routes.use('/decision', decision_routes_1.default);
// 🧬 AUTO LEARNING
routes.use('/learning', learning_routes_1.default);
// 🧠 AI ORCHESTRATOR
routes.use('/orchestrator', orchestrator_routes_1.default);
// ⚽ FOOTBALL
routes.use('/football', football_routes_1.default);
// ==========================================
// 🚀 API
// ==========================================
app.use('/api/v1', routes);
// 🔍 HEALTH CHECK
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
    });
});
// 📊 AUDITORIA GLOBAL
app.use(audit_middleware_1.auditMiddleware);
// ❌ ERROR HANDLER
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
