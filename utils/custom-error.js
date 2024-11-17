"use strict";

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static serverError(message) {
    return new CustomError(message || "A server error occurred", 500);
  }

  static clientError(message) {
    return new CustomError(message || "A client error occurred", 400);
  }

  static notFoundError(message) {
    return new CustomError(message || "Resource not found", 404);
  }

  static unauthorizedError(message) {
    return new CustomError(message || "Unauthorized access", 401);
  }

  static tooManyRequestsError(message) {
    return new CustomError(message || "Too many requests", 429);
  }
}

module.exports = CustomError;
