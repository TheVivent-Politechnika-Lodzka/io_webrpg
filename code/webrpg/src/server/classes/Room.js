



class Room {

    constructor(roomID) {
        // proste dane (id, nazwa, itp)
        this.id = roomID;
        this.gamename;
        // chat
        this.chat = []; //lista push musi dbać o maksymalny rozmiar chatu (50 ostatnich wpisów?)

        // lista graczy
    }

}

module.exports = {
    Room: Room,
}