class User {

    // przyjmuje websocket conn oraz
    // dane z bazy
    constructor(connection, userData){
        // połączenie websocket
        this.connection = connection;
        // dane użytkownika
        this.id = userData.id;
        this.username = userData.username;
        this.email = userData.email;
        // aktualny pokój
        this.currentRoom = null;
    }

    switchRoom(room){

    }

    exitRoom(){

    }


    getConnection(){
        return this.connection;
    }

    getId(){
        return this.id;
    }

    getUsername(){
        return this.username;
    }

    getEmail(){
        return this.email;
    }

}

module.exports = {
    User: User,
}