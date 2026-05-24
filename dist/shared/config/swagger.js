"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSetup = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("../../docs/swagger");
const swaggerSetup = (app) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const serverUrl = isProduction
        ? 'https://api.coreauth.dev/api/v1'
        : 'http://localhost:3000/api/v1';
    const document = {
        ...swagger_1.swaggerDocument,
        servers: [
            {
                url: serverUrl,
                description: isProduction ? 'Production' : 'Local',
            },
        ],
    };
    console.log('🔥 Swagger rodando em:', serverUrl);
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    }));
};
exports.swaggerSetup = swaggerSetup;
