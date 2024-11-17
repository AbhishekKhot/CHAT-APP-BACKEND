"use strict";
require("dotenv").config();
const Fastify = require("fastify");
const closeWithGrace = require("close-with-grace");
const loggingOptions = require("./common/logging-options.js");
const app = Fastify(loggingOptions);
const appService = require("./app.js");
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

app.addHook("onRequest", (_, reply, done) => {
  reply.startTime = process.hrtime();
  done();
});

app.addHook("onResponse", (_, reply, done) => {
  const hrtime = process.hrtime(reply.startTime);
  reply.elapsedTime = hrtime[0] * 1000 + hrtime[1] / 1000000;
  done();
});

app.listen({ port: process.env.PORT || 8080, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
