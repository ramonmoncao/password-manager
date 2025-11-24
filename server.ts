//@ts-nocheck
const http = require("http");
const next = require("next");

const {
  startAutoPasswordUpdate,
} = require("./src/services/automatic-change.service");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  startAutoPasswordUpdate();

  http.createServer((req, res) => {
    handle(req, res);
  }).listen(3000, () => {
    console.log("🚀 Server + Cron rodando em http://localhost:3000");
  });
});
