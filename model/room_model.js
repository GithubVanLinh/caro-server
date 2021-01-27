class Gamer {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  get id() {
    return this.id;
  }

  get name() {
    return this.name;
  }

  get info() {
    return { id: this.id, name: this.name };
  }
}

function removeByAttr(arr, attr, value) {
  var i = arr.length;
  while (i--) {
    if (
      arr[i] &&
      arr[i].hasOwnProperty(attr) &&
      arguments.length > 2 &&
      arr[i][attr] === value
    ) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

class Room {
  constructor(name, number = 2) {
    this.name = name;
    this.number = number;
    this.gamers = [];
  }

  get gamersCount() {
    return this.gamers.length;
  }

  /**
   * @param {Gamer} gamer gamer object
   */
  addGamer(gamer) {
    this.gamers.push(gamer);
  }

  removeGamer(id) {
      
  }
}
