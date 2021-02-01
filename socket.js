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

    socket.on("on-box-click", onBoxClick);

    socket.on("leave-room", onLeaveRoom); //create & join-room
    socket.on("disconnect", onDisconnect); //create & join-room

    /**
     * Delete a room by owner id
     * + All clients in room will be left
     * + Room will be deleted in Database
     */
    async function deleteARoomByOwnerId() {
      socket.to(socket.id).emit("room-deleted");
      io.sockets.sockets.forEach(function (s) {
        s.leave(socket.id);
      });
      await RoomService.deleteRoomByOwnerId(socket.id);
    }

    /**
     *
     * @param {String} room_name socket id
     * leave a room was joined
     * + Emit to all clients in room event "a-user-disconnect" with parameter is socketid
     * + leave joined room
     */
    async function leaveRoom(room_name) {
      if (socket.id == room_name) {
        await deleteARoomByOwnerId();
      } else {
        socket.to(room_name).emit("competitor-leave-room", socket.id);
        await RoomService.removeGamerFromRoom(room_name, socket.id);
        socket.leave(room_name);
      }
    }

    /**
     * Leave all rooms were joined
     * + Each room was joined, client will leave that room by leaveRoom
     */
    async function leaveAllRoomJoined() {
      const rooms = await RoomService.getRoomsByGamerId(socket.id);
      rooms.forEach(async (room) => {
        await leaveRoom(room.owner);
      });
    }

    /**
     * When client was disconnected, leave all room this client has joined
     *
     */
    async function onDisconnect() {
      leaveAllRoomJoined();
    }

    //++Socket callback
    /**
     *
     * @param {String} name roomname (show)
     */
    async function onCreateRoom(name) {
      const owner = socket.id;
      socket.join(socket.id);
      const room = await RoomService.createRoom(owner, name);

      socket.room_name = socket.id;
      io.emit("new-room-created", room);
      socket.emit("join-room-success", room);
    }

    async function onRoomList() {
      const list = await RoomService.getRooms();
      socket.emit("room-list", list);
    }

    async function joinRoom(room_name) {
      const room = await RoomService.addGamerToRoom(room_name, socket.id);
      socket.join(room_name);
      socket.room_name = room_name;
      socket.emit("join-room-success", room);
    }

    async function setGamerTurn(room_name) {
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
    }

    async function setFirstTurn(room_name) {
      await RoomService.setTurn(room_name, 1);
      if (socket.turn == 1) {
        socket.emit("choose-box", {});
      }
    }

    async function initTurn(room_name) {
      await setGamerTurn(room_name);
      await setFirstTurn(room_name);
    }

    async function startGame(room_name) {
      io.to(room_name).emit("has-2-player");
      io.to(room_name).emit("game-start");
      await initTurn(room_name);
    }

    async function hasRoomFull(room_name) {
      const size = await RoomService.getRoomSizeByOwnerId(room_name);
      if (
        !io.sockets.adapter.rooms.get(room_name) ||
        (io.sockets.adapter.rooms.get(room_name).size < 2 && size < 2)
      ) {
        return false;
      } else if (
        size == 2 &&
        io.sockets.adapter.rooms.get(room_name).size == 2
      ) {
        return true;
      }
    }

    async function onJoinRoom(room_name) {
      if (!(await hasRoomFull(room_name))) {
        await joinRoom(room_name);
        if (await hasRoomFull(room_name)) {
          startGame(room_name);
        }
      } else {
        socket.emit("error", { message: `${room_name} was already full` });
      }
      console.log(socket._events);
    }

    /**
     *
     * @param {String} room_name owner id
     */
    async function onLeaveRoom(room_name) {
      leaveRoom(room_name);
    }

    async function onBoxClick(x, y) {
      console.log("room_name", socket.room_name);
      try {
        const room = await RoomService.getRoomByOwnerId(socket.room_name);
        if (room.turn == socket.turn) {
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
      } catch (error) {
        console.log("error" , error.message);
        socket.emit("error", {message: error.message});
        console.log(error.message);
      }
    }
    //--Socket callback
  });

  //--SOCKET
};
