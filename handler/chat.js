const { HTTP_STATUS } = require("../common/http-status");
const userService = require("../services/user");
const messageService = require("../services/chat");

async function getChatsHandler(request, reply) {
  const { phone_number, country_code } = request.query;
  const user = await userService.getUserByPhoneNumber(
    phone_number,
    country_code
  );
  if (!user)
    return reply.send({
      ok: true,
      statusCode: HTTP_STATUS.NOT_FOUND,
      data: {},
    });

  const { redis } = this;

  let messages = await redis.get(user.id);

  if (messages)
    return reply.send({
      ok: true,
      statusCode: HTTP_STATUS.OK.code,
      data: messages,
    });

  messages = await messageService.getMessages(user.id);

  await redis.set(user.id, messages);

  return reply.send({
    ok: true,
    statusCode: HTTP_STATUS.OK.code,
    data: messages,
  });
}

module.exports = { getChatsHandler };
