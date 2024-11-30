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

// app.register(require("@fastify/cors"), (instance) => ({
//   origin: (origin, callback) => {
//     // Allow requests from specific origins
//     const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
//     console.log("ALLOWED_ORIGIN: ", allowedOrigins);
//     if (!origin || allowedOrigins.includes(origin)) {
//       // Null origin is for non-browser clients like curl
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// }));

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
