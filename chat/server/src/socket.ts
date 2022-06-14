import axios from "axios";

import app from "@/app";

const setRequests = (io: any) => {
  io.on("connection", (socket: any) => {
    app.logger.info("a user has connected", { service: "socket" });

    socket.on("online", (up: string) => {
      // Store up number
      socket.up = up;
      app.logger.info(`user ${up} has connected`, { service: "socket" });

      axios
        .post(`http://mongo_chat_server:3000/user/${up}`, { online: true })
        .then((res: any) => {
          app.logger.info(`user ${up} has been set to online`, {
            message: res.data,
            service: "socket",
          });
        })
        .catch((err: any) => {
          app.logger.error(`failed to set user ${up} to online`, {
            message: err.message,
            service: "socket",
          });
        });
    });

    socket.on("disconnect", () => {
      app.logger.info("a user has disconnected", { service: "socket" });

      axios
        .post(`http://mongo_chat_server:3000/user/${socket.up}`, {
          online: false,
        })
        .then((res: any) => {
          app.logger.info(`user ${socket.up} has been set to offline`, {
            message: res.data,
            service: "socket",
          });
        })
        .catch((err: any) => {
          app.logger.error(`failed to set user ${socket.up} to offline`, {
            message: err.message,
            service: "socket",
          });
        });
    });

    socket.on(
      "chat message",
      (msg: string, from: string, room: string, timestamp: string) => {
        app.logger.info("sending message", {
          message: [msg, from, room, timestamp].join(" "),
          service: "socket",
        });

        axios
          .post("http://mongo_chat_server:3000/message/", {
            group: room,
            message: msg,
            from: from,
          })
          .then((res: any) => {
            app.logger.info(`add message to group ${room} (in database)`, {
              message: res.data,
              service: "socket",
            });
          })
          .catch((err: any) => {
            app.logger.info(
              `failed to add message to group ${room} (in database)`,
              {
                message: err.message,
                service: "socket",
              }
            );
          });
        io.to(room).emit(`${room} message`, from, msg, timestamp);
      }
    );

    socket.on("join room", (username: string, room: string) => {
      app.logger.info(`${username} joined ${room}`, {
        service: "socket",
      });
      socket.join(room);
    });
  });
};

export default setRequests;
