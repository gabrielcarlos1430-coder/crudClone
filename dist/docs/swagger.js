"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
const users_path_1 = require("./paths/users.path");
const auth_path_1 = require("./paths/auth.path");
const user_docs_1 = require("./schemas/user.docs");
const auth_docs_1 = require("./schemas/auth.docs");
exports.swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'CoreAuth API',
        version: '1.0.0',
        description: 'API de usuários e autenticação com JWT',
    },
    servers: [
        {
            url: process.env.NODE_ENV === 'production'
                ? 'https://api.coreauth.dev/api/v1'
                : 'http://localhost:3000/api/v1',
        },
    ],
    tags: [
        {
            name: 'Users',
            description: 'CRUD de usuários',
        },
        {
            name: 'Auth',
            description: 'Autenticação e login',
        },
    ],
    paths: {
        ...users_path_1.userPaths,
        ...auth_path_1.authPaths,
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Formato: Bearer {token}',
            },
        },
        schemas: {
            ...user_docs_1.userSchemas,
            ...auth_docs_1.authSchemas,
        },
    },
    // 🔐 Protege tudo por padrão
    security: [
        {
            bearerAuth: [],
        },
    ],
};
