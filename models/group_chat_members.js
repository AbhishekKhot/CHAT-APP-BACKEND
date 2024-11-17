"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupChatMember extends Model {
    static associate(models) {
      GroupChatMember.belongsTo(models.GroupChat, {
        foreignKey: "group_chat_id",
        as: "groupChat",
      });
      GroupChatMember.belongsTo(models.User, {
        foreignKey: "member_user_id",
        as: "member",
      });
    }
  }
  GroupChatMember.init(
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
      member_user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "group_chat_members",
      timestamps: true,
      underscored: true,
    }
  );
  return GroupChatMember;
};
