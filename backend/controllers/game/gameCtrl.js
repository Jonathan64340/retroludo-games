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

            this.socket.on('create', () => {
                // Get all rooms available length
                let roomId = Array.from(this.socket.adapter.rooms.entries()).length + 1;
                this.createGame({ roomId: `room-${roomId}` });
            });
            this.socket.on('join', (data) => {
                this.joinGame({ roomId: `room-${data.roomId}` });
            });

            this.socket.on('disconnect', (raison) => {
                console.log('disconnected ' + socket.id + ' + raison : ' + raison)
            })

        })
    }

    getRoomClientsNumber = (room) => this.socket.adapter.rooms.get(room) ? this.socket.adapter.rooms.get(room).size : undefined;

    getRoomClients = (room) => this.socket.adapter.rooms.get(room);

    getRooms = () => this.socket.adapter.rooms;


    createGame({ roomId }) {
        if (this.socket) {
            this.socket.join(roomId);
            this.io.to(this.socket.id).emit('on-create', { roomId });
            this.io.to(roomId).emit('room-info', { message: `Player ${this.socket.id} joined!` });
        }
    }

    joinGame({ roomId }) {
        if (this.socket && typeof this.getRoomClientsNumber(roomId) !== 'undefined' && this.getRoomClientsNumber(roomId) < 2) {
            this.socket.join(roomId);
            this.io.to(this.socket.id).emit('on-join', { roomId });
            this.io.to(roomId).emit('room-info', { message: `Player ${this.socket.id} joined!` })
        } else {
            this.io.to(this.socket.id).emit('on-join-error', { message: 'Unable to connect to this game!' });
        }
    }
}

module.exports = GameCtrl;