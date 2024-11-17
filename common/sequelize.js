"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config();

class DatabaseInstance {
  constructor() {
    return this.#init();
  }

  #init() {
    const db = {};
    const config = this.#getDatabaseConfig();

    const sequelize = new Sequelize(config.replication.write.url, config);

    this.#registerModels(db, sequelize);
    this.#createAssociations(db);

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    db.Op = Sequelize.Op;

    return Object.freeze(db);
  }

  #getDatabaseConfig() {
    const config = {
      replication: {
        read: [this.#getReadDatabaseConfig(process.env.DATABASE_URL)],
        write: {
          url: this.#getWriteDatabaseUrl(),
        },
      },
      dialect: "postgres",
      pool: {
        max: 100,
        min: 20,
        acquire: 60000,
        idle: 10000,
      },
      logging: process.env.NODE_ENV === "development" ? console.log : false,
    };
    return config;
  }

  #getReadDatabaseConfig(DatabaseURL) {
    const url = new URL(DatabaseURL);
    return {
      host: url.hostname,
      port: url.port || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1),
    };
  }

  #getWriteDatabaseUrl() {
    return process.env.NODE_ENV === "test"
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL;
  }

  #createAssociations(db) {
    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  }

  #registerModels(db, sequelize) {
    const modelsPath = path.join(path.resolve(), "models");
    const basename = path.basename(__filename);

    fs.readdirSync(modelsPath)
      .filter(
        (file) =>
          file.indexOf(".") !== 0 &&
          file !== basename &&
          file.slice(-3) === ".js"
      )
      .forEach((file) => {
        const model = require(path.join(modelsPath, file))(
          sequelize,
          Sequelize.DataTypes
        );
        db[model.name] = model;
      });
  }
}

module.exports = (() => {
  let instance = null;
  return () => {
    if (!instance) {
      instance = new DatabaseInstance();
    }
    return instance;
  };
})();
