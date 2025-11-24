"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecurePassword = generateSecurePassword;
function generateSecurePassword(length) {
    if (length === void 0) { length = 32; }
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";
    var charsLength = chars.length;
    var getCrypto = function () {
        if (typeof globalThis.crypto !== "undefined")
            return globalThis.crypto;
        throw new Error("Crypto API não suportada neste ambiente");
    };
    var cryptoObj = getCrypto();
    var randomValues = new Uint8Array(length);
    cryptoObj.getRandomValues(randomValues);
    var password = "";
    for (var i = 0; i < length; i++) {
        password += chars[randomValues[i] % charsLength];
    }
    return password;
}
