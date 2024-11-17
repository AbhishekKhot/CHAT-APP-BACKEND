"use strict";
require("dotenv").config();
const path = require("path");
const AutoLoad = require("@fastify/autoload");

module.exports = async function (fastify, options) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, options),
    dirNameRoutePrefix: false,
    ignorePattern: /.*.no-load\.js/,
    indexPattern: /^no$/i,
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    autoHooksPattern: /.*hooks(\.js|\.cjs)$/i,
    autoHooks: true,
    cascadeHooks: true,
    dirNameRoutePrefix: {
      user: "user",
    },
    options: Object.assign({}, options),
  });
};
