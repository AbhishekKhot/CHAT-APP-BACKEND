"use strict";
const crypto = require("crypto");
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
  proxyConfig: {
    trustProxy: true,
    onProtoPoisoning: "remove",
    onConstructorPoisoning: "remove",
  },
  logger: {
    level: process.env.LOG_LEVEL || "info",
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
      }),
    },
    customLogLevel: (res) => {
      if (res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  },
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || false,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "x-request-id"],
    credentials: true,
    maxAge: 86400, // 24 hours - how long browsers should cache CORS response
  },
};
