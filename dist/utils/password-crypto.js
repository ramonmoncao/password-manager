"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
var crypto_1 = require("crypto");
var algorithm = "aes-256-cbc";
function encrypt(text, keyBase64, ivBase64) {
    var key = Buffer.from(keyBase64, "base64");
    var iv = Buffer.from(ivBase64, "base64");
    var cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    var encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}
function decrypt(encrypted, keyBase64, ivBase64) {
    var key = Buffer.from(keyBase64, "base64");
    var iv = Buffer.from(ivBase64, "base64");
    var decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
    var decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
