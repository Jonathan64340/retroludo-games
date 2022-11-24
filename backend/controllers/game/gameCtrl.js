const Core = require('../core/coreCtrl');

class GameCtrl extends Core {

    db = undefined;
    io = undefined;
    socket = undefined;

    init(db, io) {
        if (db) this.db = db;
        if (io) this.io = io;

        this.io.on('connection', (socket) => {
            if (socket) this.socket = socket;
            this.socket.on('create', (data) => {
                let roomId = Object.keys(this.socket.adapter.rooms).length;
                this.createGame({ roomId: 1, sid: socket.id });
            });
            this.socket.on('join', (data) => {
                this.joinGame({ roomId: 1, sid: socket.id });
            });
        })
    }

    getRoomClientsNumber = (room) => this.socket.adapter.rooms.get(room).size;

    getRoomClients = (room) => this.socket.adapter.rooms.get(room);


    createGame({ roomId, sid }) {
        if (this.socket) {
            this.socket.join(roomId);
            this.socket.to(sid).emit('on-create', { roomId });
            this.socket.to(roomId).emit('room-info', { sid });
        }
    }

    joinGame({ roomId, sid }) {
        if (this.socket && this.getRoomClientsNumber(roomId) < 2) {
            this.socket.join(roomId);
            this.socket.to(sid).emit('on-join', { roomId });
            this.socket.to(roomId).emit('room-info', { sid });
            console.log(this.getRoomClients(roomId))
        } else {
            console.log("Nope j'ai pas envie !")
        }
    }
}

module.exports = GameCtrl;