const { serverError } = require("../utils/custom-error");
const path = require("path");
const fs = require("fs/promises");

async function addSchema(fastify, directoryName) {
  try {
    const schemasDirectory = path.join(directoryName, "schema");
    const files = await fs.readdir(schemasDirectory);
    for (const file of files) {
      const filePath = path.join(schemasDirectory, file);
      fastify.addSchema(require(filePath));
    }
  } catch (error) {
    throw serverError(
      `Error loading schema from ${directoryName}:${error.message}`
    );
  }
}

module.exports = { addSchema };
