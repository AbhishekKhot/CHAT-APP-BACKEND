"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupChat extends Model {
    static associate(models) {
      GroupChat.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      GroupChat.hasMany(models.GroupChatMember, {
        foreignKey: "group_chat_id",
        as: "members",
      });
      GroupChat.hasMany(models.GroupChatMessage, {
        foreignKey: "group_chat_id",
        as: "messages",
      });
    }
  }
  GroupChat.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      group_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "group_chats",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return GroupChat;
};
