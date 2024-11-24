"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Contact, {
        foreignKey: "contact_user_id",
        as: "contacts",
      });
      User.hasMany(models.Contact, {
        foreignKey: "contacted_user_id",
        as: "contactedUsers",
      });
      User.hasMany(models.GroupChat, {
        foreignKey: "created_by",
        as: "groupChats",
      });
      User.hasMany(models.GroupChatMember, {
        foreignKey: "member_user_id",
        as: "groupChatMembers",
      });
      User.hasMany(models.Chat, {
        foreignKey: "from_user_id",
        as: "sentMessages",
      });
      User.hasMany(models.Chat, {
        foreignKey: "to_user_id",
        as: "receivedMessages",
      });
      User.hasMany(models.GroupChatMessage, {
        foreignKey: "message_author_id",
        as: "groupChatMessages",
      });
      User.hasMany(models.MessageTag, {
        foreignKey: "tagged_user_id",
        as: "taggedMessages",
      });
    }
  }
  User.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING,
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
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return User;
};
