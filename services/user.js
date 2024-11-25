const db = require("../common/sequelize")();

class User {
  async getUserByPhoneNumber(phoneNumber, countryCode) {
    return await db.User.findOne({
      where: {
        phone_number: phoneNumber,
        country_code: countryCode,
      },
    });
  }

  async create(body) {
    return await db.User.findOrCreate({
      where: {
        first_name: body.first_name,
        last_name: body.last_name,
        phone_number: body.phone_number,
      },
      defaults: {
        ...body,
      },
    });
  }

  async sendOtp(phoneNumber, countryCode, fastify) {
    const { redis } = fastify;
    const existingOTP = await redis.get(`${countryCode}${phoneNumber}`);
    if (existingOTP) return existingOTP;
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`${countryCode}${phoneNumber}`, OTP);
    return OTP;
  }

  async verifyOtp(phoneNumber, countryCode, OTP, fastify) {
    const { redis } = fastify;
    const storedOTP = await redis.get(`${countryCode}${phoneNumber}`);
    if (!storedOTP) return false;
    return true;
    // if (OTP === storedOTP) {
    //   await redis.del(phoneNumber);
    //   return true;
    // }
    // return false;
  }

  async getUsers(phoneNumber) {
    const users = await db.User.findAll({
      where: {
        phone_number: phoneNumber,
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "country_code",
        "phone_number",
      ],
    });
    return users.map((user) => ({
      id: user.id,
      username: user.first_name.charAt(0) + user.last_name.charAt(0),
      phone_number: user.phone_number,
      country_code: user.country_code,
    }));
  }
}

module.exports = new User();
