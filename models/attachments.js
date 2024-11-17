"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    static associate(models) {
      Attachment.belongsTo(models.Chat, { foreignKey: "chat_id", as: "chat" });
    }
  }
  Attachment.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      chat_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "chats",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      create_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "attachments",
      timestamps: true,
      underscored: true,
    }
  );
  return Attachment;
};
