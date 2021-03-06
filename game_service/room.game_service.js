const Room = require("../game_model/Room");
const socket = require("../socket");

const rooms = [];

module.exports = {
  createRoom: createRoom,
  getRooms: getRooms,
  getListRoomName: getListRoomName,
  getRoomByOwnerId: getRoomByOwnerId,
  deleteRoomByOwnerId: deleteRoom,
  getRoomSizeByOwnerId: getSize,
  addGamerToRoom: addGamerToRoom,
  setTurn: setTurn,
  getTurn: getTurn,
  updateBoard: updateBoard,
  removeGamerFromRoom: removeGamerFromRoom,
  getRoomsByGamerId: getRoomsByGamerId,
  resetBoard: resetBoard,
  setRoomStatus: setRoomStatus,
  resetRoom: resetRoom,
  checkBoard: checkBoard,
};

function checkBoard(room_name) {
  const promise = new Promise((resolve, reject) => {
    rooms.forEach((room) => {
      if (room.owner === room_name) {
        const result = room.checkBoard();
        resolve(result);
      }
    });
    reject(new Error(`${room_name} is not found`));
  });
  return promise;
}

function resetRoom(room_name) {
  return resetBoard(room_name);

}

function resetBoard(room_name) {
  const promise = new Promise((resolve, reject) => {
    rooms.forEach(async (room) => {
      if (room.owner === room_name) {
        room.resetBoard();
        await setRoomStatus(room_name, false);
        resolve();
      }
    });
    reject(new Error(`${room_name} is not found`));
  });
  return promise;
}

/**
 * 
 * @param {String} room_name socketid
 * @param {Boolean} status is ingame
 */
function setRoomStatus(room_name, status) {
  const promise = new Promise((resolve, reject) => {
    rooms.forEach((room) => {
      if (room.owner === room_name) {
        room.ingame = status;
        resolve(room);
      }
    });
    reject(new Error(`${room_name} is not found`));
  });
  return promise;
}
/**
 *
 * @param {String} owner
 * @param {String} name
 */
function createRoom(owner, name) {
  console.log("create room", owner, name);
  const promise = new Promise((resolve, reject) => {
    const room = new Room(name, owner);

    console.log("create done");
    console.log(room);
    rooms.push(room);
    resolve(room);
  });
  return promise;
}

function getTurn(room_name) {
  const promise = new Promise(function (resolve, reject) {
    rooms.forEach((room) => {
      if (room.owner === room_name) {
        resolve(room.turn);
      }
    });
    reject(new Error(`${room_name} is not found`));
  });

  return promise;
}

function updateBoard(room_name, turn, x, y) {
  const promise = new Promise(function (resolve, reject) {
    rooms.forEach((room) => {
      if (room.owner === room_name) {
        console.log(room);
        room.board.setBoard(x, y, turn);
        resolve(room);
      }
    });
    reject(new Error(`${room_name} is not found`));
  });

  return promise;
}

function addGamerToRoom(room_name, gamer) {
  const promise = new Promise(function (resolve, reject) {
    rooms.forEach((room) => {
      if (room.owner === room_name) {
        console.log("in");
        room.addGamer(gamer);
        resolve(room);
      }
    });
    reject(new Error(`${room_name} is not found`));
  });

  return promise;
}

function getRooms() {
  const promise = new Promise(function (resolve) {
    resolve(rooms);
  });

  return promise;
}

function setTurn(room_name, turn) {
  const promise = new Promise(function (resolve, reject) {
    rooms.forEach((room) => {
      if (room.owner === room_name) {
        room.turn = turn;
        resolve(room);
      }
    });
    reject(new Error(`${room_name} is not found`));
  });

  return promise;
}

function getListRoomName() {
  const promise = new Promise(function (resolve) {
    const roomnameList = [];
    rooms.forEach((room) => {
      roomnameList.push(room.name);
    });
    resolve(roomnameList);
  });

  return promise;
}

async function getSize(room_name) {
  const room = await getRoomByOwnerId(room_name);
  return room.gamers.length;
}

/**
 *
 * @param {String} name owner(socketid)
 */
function getRoomByOwnerId(name) {
  return new Promise((resolve, reject) => {
    rooms.forEach((room) => {
      if (room.owner === name) {
        return resolve(room);
      }
    });
    return reject(new Error(`Room ${name} is not found`));
  });
}
/**
 *
 * @param {String} owner socketid
 */
function deleteRoom(owner) {
  return new Promise((resolve, reject) => {
    rooms.forEach((room, index) => {
      if (room.owner === owner) {
        rooms.splice(index, 1);
        return resolve();
      }
    });
    return reject(new Error(`Room ${owner} is not found`));
  });
}

function removeGamerFromRoom(room_name, gamerId) {
  if (room_name === gamerId) {
    return deleteRoom(room_name);
  }
  return new Promise((resolve, reject) => {
    rooms.forEach((room, index) => {
      if (room.owner === room_name) {
        const status = room.removeGamer(gamerId);
        if (status == -1) {
        }
        return resolve();
      }
    });
    return reject(new Error(`Room ${room_name} is not found`));
  });
}

function getRoomsByGamerId(gamerId) {
  return new Promise((resolve, reject) => {
    const roomlist = [];
    rooms.forEach((room, index) => {
      if (room.gamers.includes(gamerId)) {
        roomlist.push(room);
      }
    });

    return resolve(roomlist);
  });
}
