"use strict";
const crypto = require("crypto");

module.exports = {
  // Request handling settings
  requestConfig: {
    // Maximum time to wait for the client to send the request
    connectionTimeout: 30000, // 30 seconds
    // Maximum size of request body
    bodyLimit: 5 * 1024 * 1024, // 5MB
  },

  // Request ID configuration for request tracking
  requestId: {
    header: "x-request-id",
    // Generate unique request ID or use existing one from headers
    generate: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
  },

  // Security settings for proxy handling
  proxyConfig: {
    // Trust X-Forwarded-* headers
    trustProxy: true,
    // Protection against prototype pollution attacks
    onProtoPoisoning: "remove",
    onConstructorPoisoning: "remove",
  },

  // Logging configuration
  logger: {
    level: process.env.LOG_LEVEL || "info",
    development: process.env.NODE_ENV !== "production",
    // Sensitive data to be redacted from logs
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
    // Custom log serializers for requests, responses, and errors
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.raw.url,
        headers: req.headers,
        body: req.routeConfig?.logBody ? req.body : undefined,
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
    // Set appropriate log level based on response status
    customLogLevel: (res) => {
      if (res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  },

  // CORS (Cross-Origin Resource Sharing) configuration
  cors: {
    // Allow origins from environment variable or disable CORS
    origin: process.env.ALLOWED_ORIGINS?.split(",") || false,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "x-request-id"],
    credentials: true,
    maxAge: 86400, // 24 hours - how long browsers should cache CORS response
  },
};
