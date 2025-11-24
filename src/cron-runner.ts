import { startAutoPasswordUpdate } from "./services/automatic-change.service.ts"; // ajusta o caminho relativo

console.log("🚀 Inicializando cron...");

startAutoPasswordUpdate();
