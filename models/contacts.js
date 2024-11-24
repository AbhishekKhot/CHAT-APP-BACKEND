"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      Contact.belongsTo(models.User, {
        foreignKey: "contact_user_id",
        as: "user",
      });
      Contact.belongsTo(models.User, {
        foreignKey: "contacted_user_id",
        as: "contactedUser",
      });
    }
  }
  Contact.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      contact_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contacted_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "blocked"),
        allowNull: false,
      },
      create_at: {
        type: DataTypes.DATE,
      },
      update_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "contacts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return Contact;
};
