module.exports = {
  HTTP_STATUS: {
    OK: { code: 200, message: "OK" },
    CREATED: { code: 201, message: "Created" },
    ACCEPTED: { code: 202, message: "Accepted" },
    NO_CONTENT: { code: 204, message: "No Content" },
    BAD_REQUEST: { code: 400, message: "Bad Request" },
    UNAUTHORIZED: { code: 401, message: "Unauthorized" },
    FORBIDDEN: { code: 403, message: "Forbidden" },
    NOT_FOUND: { code: 404, message: "Not Found" },
    METHOD_NOT_ALLOWED: { code: 405, message: "Method Not Allowed" },
    CONFLICT: { code: 409, message: "Conflict" },
    UNSUPPORTED_MEDIA_TYPE: { code: 415, message: "Unsupported Media Type" },
    PAGE_EXPIRED: { code: 419, message: "Expired" },
    INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
    SERVICE_UNAVAILABLE: { code: 503, message: "Service Unavailable" },
  },
};
