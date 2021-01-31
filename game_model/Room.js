const Board = require('./Board');
class Room {
    // #board;
    // #gamers;
    // #ingame;
    // #name;
    // #turn;
    // #owner;

    /**
     * 
     * @param {String} name name of room
     * @param {String} owner socket Id
     */
    constructor(name, owner){
        if(name && owner){
            console.log("create board");
            this.board = new Board();
            this.gamers = [];
            this.ingame = false;
            this.name = name;
            this.turn = 1;
            this.owner = owner;
            this.addGamer(this.owner);
        } else {
            throw new Error("name and owner is required")
        }

    }
    // get board(){
    //     return this.#board;
    // }
    // get gamers() {
    //     return this.#gamers;
    // }
    // get ingame(){
    //     return this.#ingame;
    // }
    // get name(){
    //     return this.#name;
    // }
    // get turn(){
    //     return this.#turn;
    // }
    // get owner(){
    //     return this.#owner;
    // }

    // set ingame(isIngame){
    //     this.#ingame = isIngame;
    // }

    // set name(name){
    //     this.#name = name;
    // }

    // set turn(turn){
    //     this.#turn = turn;
    // }

    /**
     * @param {String}gamerId socket id
     */
    addGamer(gamerId){
        if(this.gamers.length < 2){
            this.gamers.push(gamerId);
            return true;
        }
        return false;
    }

    /**
     * @param {String}gamerId socket id
     * Return 1 mean delete owner
     */
    removeGamer(gamerId){
        this.gamers.forEach((id, index)=>{
            if(id === gamerId){
                this.gamers.splice(index, 1);
                if(gamerId === this.owner){
                    return 1;
                }
                return 0;
            }
        });
        if (this.gamers.length == 0) {
            this.resetBoard();
        }
    }

    resetBoard(){
        this.board.resetBoard();
    }
    
    
}

module.exports = Room;