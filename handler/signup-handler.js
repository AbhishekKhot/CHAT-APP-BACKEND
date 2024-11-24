const userService = require("../services/user");
const { HTTP_STATUS } = require("../common/http-status");

async function singupHandler(request, reply) {
  const [user, created] = await userService.create(request.body);

  reply.send({
    ok: true,
    statusCode: created
      ? HTTP_STATUS.CREATED.code
      : HTTP_STATUS.NO_CONTENT.code,
    data: user,
  });
}

async function signinHandler(request, reply) {
  const { phone_number, country_code } = request.body;
  const user = await userService.getUserByPhoneNumber(
    phone_number,
    country_code
  );
  if (!user) {
    return reply.send({
      ok: true,
      statusCode: HTTP_STATUS.NOT_FOUND.code,
      data: {},
    });
  }
  const OTP = await userService.sendOtp(phone_number, country_code, this);
  reply.send({
    ok: true,
    statusCode: HTTP_STATUS.OK.code,
    data: OTP,
  });
}

async function verifyOtpHandler(request, reply) {
  const { phone_number, country_code, otp } = request.body;
  const status = await userService.verifyOtp(
    phone_number,
    country_code,
    otp,
    this
  );
  reply.send({
    ok: true,
    statusCode: status ? HTTP_STATUS.OK.code : HTTP_STATUS.BAD_REQUEST.code,
    data: {},
  });
}

module.exports = { singupHandler, signinHandler, verifyOtpHandler };
