const fastify = require("fastify");
const { Server } = require("socket.io");
require("dotenv").config();

const PORT = process.env.PORT;

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

fastify.register(require("fastify-cors"), {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});

const server = fastify.listen(PORT, (error) => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  console.log(`Server listening on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by cors"));
      }
    },
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("message", (message) => {
    console.log(`Message received: ${message}`);
    socket.emit("response", "Message received");
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
