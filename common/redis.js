"use strict";

const Redis = require("ioredis");

let client;

function getClient() {
  if (!client) {
    client = new Redis(process.env.REDIS_URL);
  }
  return client;
}

module.exports = getClient;
