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
    if (OTP === storedOTP) {
      await redis.del(phoneNumber);
      return true;
    }
    return false;
  }
}

module.exports = new User();
