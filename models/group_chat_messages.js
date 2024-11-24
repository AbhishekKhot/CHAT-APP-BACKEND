"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupChatMessage extends Model {
    static associate(models) {
      GroupChatMessage.belongsTo(models.GroupChat, {
        foreignKey: "group_chat_id",
        as: "groupChat",
      });
      GroupChatMessage.belongsTo(models.User, {
        foreignKey: "message_author_id",
        as: "author",
      });
      GroupChatMessage.hasMany(models.MessageTag, {
        foreignKey: "message_id",
        as: "tags",
      });
    }
  }
  GroupChatMessage.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      group_chat_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "group_chats",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      message_author_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      message: {
        type: DataTypes.TEXT,
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
      tableName: "group_chat_messages",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return GroupChatMessage;
};
