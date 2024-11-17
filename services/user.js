const db = require("../common/sequelize")();

class User {
  async getUserByPhoneNumber(phoneNumber) {
    return await db.User.findOne({
      where: {
        phone_number: phoneNumber,
      },
    });
  }
}

module.exports = new User();
