module.exports = (server) => {
  var io = require("socket.io")(server);

  // GAME
  const RoomService = require("./game_service/room.game_service");
  //++SOCKET

  io.on("connection", function (socket) {
    console.log("gamers", io.engine.clientsCount);

    socket.on("create-room", onCreateRoom);
    socket.on("room-list", onRoomList);
    socket.on("join-room", onJoinRoom);
    socket.on("leave-room", onLeaveRoom);
    socket.on("on-box-click", onBoxClick);

    //++Socket callback
    /**
     *
     * @param {String} name roomname (show)
     */
    async function onCreateRoom(name) {
      console.log("Oncreate Room", name, socket.id);
      const owner = socket.id;
      socket.join(socket.id);
      const room = await RoomService.createRoom(owner, name);
      console.log(room.owner, room.name);
      socket.room_name = socket.id;
      socket.emit("join-room-success", room);
    }

    async function onRoomList(message) {
      list = await RoomService.getRooms();
      socket.emit("room-list", list);
      console.log(list);
    }

    async function onJoinRoom(room_name) {
      if (
        !io.sockets.adapter.rooms.get(room_name) ||
        io.sockets.adapter.rooms.get(room_name).size < 2
      ) {
        const size = await RoomService.getRoomSizeByOwnerId(room_name);
        if (size && size < 2) {
          const room = await RoomService.addGamerToRoom(room_name, socket.id);
          socket.join(room_name);
          socket.room_name = room_name;

          socket.emit("join-room-success", room);

          if (io.sockets.adapter.rooms.get(room_name).size == 2) {
            console.log(`${room_name}: size = 2`);
            io.to(room_name).emit("has-2-player");
            await RoomService.setTurn(room_name, 1);
            console.log("set on ready");

            if (io.sockets.adapter.rooms.get(room_name).size == 2) {
              console.log("emit game start");
              io.to(room_name).emit("game-start");
              var turn = Math.round(Math.random() * 1);
              io.sockets.adapter.rooms.get(room_name).forEach((element) => {
                var soc = io.sockets.sockets.get(element);
                if (turn == 0) {
                  io.sockets.sockets.get(element).turn = 1;
                  turn++;
                } else {
                  io.sockets.sockets.get(element).turn = 2;
                  turn--;
                }
                soc.emit("your-turn", { turn: soc.turn });
              });

              if (socket.turn == 1) {
                socket.emit("choose-box", {});
              }
            }
          }
        }
      } else {
        socket.emit("error", { message: `${room_name} was already full` });
      }

      console.log(socket._events);
    }

    /**
     *
     * @param {String} namename owner id
     */
    async function onLeaveRoom(roomname) {
      if (socket.id == roomname) {
        await RoomService.deleteRoomByOwnerId(socket.id);
      }
      socket.leave(roomname);
    }

    async function onBoxClick(x, y) {
      console.log("room_name", socket.room_name);
      const room = await RoomService.getRoomByName(socket.room_name);
      console.log(room);
      if (room.turn == socket.turn) {
        console.log("on-box-click", "x, y, turn", x, y, socket.turn);

        console.log("on-box-click", "current turn", room.turn);

        await RoomService.updateBoard(socket.room_name, socket.turn, x, y);

        switch (socket.turn) {
          case 1:
            await RoomService.setTurn(socket.room_name, 2);
            break;

          case 2:
            await RoomService.setTurn(socket.room_name, 1);
            break;
          default:
            break;
        }
        socket.to(socket.room_name).broadcast.emit("choose-box", {
          x: x,
          y: y,
          turn: socket.turn,
        });
      } else {
        socket.emit("error", { message: "Not your turn" });
      }
    }
    //--Socket callback
  });

  //--SOCKET
};
