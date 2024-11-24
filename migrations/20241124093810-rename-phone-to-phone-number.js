"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("users", "phone", "phone_number");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("users", "phone_number", "phone");
  },
};
