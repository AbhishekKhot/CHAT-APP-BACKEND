"use strict";
require("dotenv").config();
const Fastify = require("fastify");
const closeWithGrace = require("close-with-grace");
const loggingOptions = require("./common/logging-options.js");
const app = Fastify(loggingOptions);
const appService = require("./app.js");

app.register(require("@fastify/cors"), {
  origin: process.env.ALLOWED_ORIGINS?.split(","),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
});

app.register(appService);

const closeListeners = closeWithGrace(
  { delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 },
  async function ({ signal, err, manual }) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  }
);

app.addHook("onClose", async (_, done) => {
  closeListeners.uninstall();
  done();
});

app.listen({ port: process.env.PORT || 8080, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
