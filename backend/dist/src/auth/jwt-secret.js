"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = getJwtSecret;
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET não definido. Configure-o no arquivo .env');
    }
    return secret;
}
//# sourceMappingURL=jwt-secret.js.map