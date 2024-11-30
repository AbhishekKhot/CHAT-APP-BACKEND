"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  requestConfig: {
    connectionTimeout: 30000, // 30 seconds
    bodyLimit: 5 * 1024 * 1024, // 5MB
  },
  requestId: {
    header: "x-request-id",
    generate: (req) => req.headers["x-request-id"] || uuidv4(),
  },
  logger: {
    level: "info",
    development: process.env.NODE_ENV !== "production",
    redact: {
      censor: "***",
      paths: [
        "req.headers.authorization",
        "req.headers['x-api-key']",
        "req.body.password",
        "req.body.email",
        "req.body.token",
      ],
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.raw.url,
        headers: req.headers,
        body: req.routeOptions?.config?.logBody ? req.body : undefined,
        remoteAddress: req.ip,
        reqId: req.id,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        responseTime: res.elapsedTime,
        reqId: res.request?.id,
      }),
      err: (err) => ({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        statusCode: err.statusCode,
        backtrace: err.stack,
      }),
    },
  },
};
