"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attachments", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chat_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "chats",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      create_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("attachments");
  },
};
