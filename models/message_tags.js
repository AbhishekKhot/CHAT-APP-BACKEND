"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MessageTag extends Model {
    static associate(models) {
      MessageTag.belongsTo(models.GroupChatMessage, {
        foreignKey: "message_id",
        as: "message",
      });
      MessageTag.belongsTo(models.User, {
        foreignKey: "tagged_user_id",
        as: "taggedUser",
      });
    }
  }
  MessageTag.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      message_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "group_chat_messages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      tagged_user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "message_tags",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return MessageTag;
};
