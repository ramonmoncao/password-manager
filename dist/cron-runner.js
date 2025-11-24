"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var automatic_change_service_1 = require("./services/automatic-change.service"); // ajusta o caminho relativo
console.log("🚀 Inicializando cron...");
(0, automatic_change_service_1.startAutoPasswordUpdate)();
