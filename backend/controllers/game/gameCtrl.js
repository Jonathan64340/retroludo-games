const Core = require('../core/coreCtrl');
const { getRoomClients } = require('../core/roomsManager');
const { createGame, joinGame } = require('./tictactoe/tictactoe');

class GameCtrl extends Core {

    db = undefined;
    log = undefined;
    clients = [];

    // constructor() {
    //     super();
    //     setInterval(() => {
    //         console.log(this.clients)
    //     }, 1000)
    // }

    countPlayers = () => {
        return this.clients.length;
    }

    findClient(clientId) {
        const find = this.clients.find(client => client.id === clientId);

        if (find) {
            return find;
        }
    }

    addClient(socket, roomId = null) {
        this.clients.push({ id: socket.id, ...(roomId ? { roomId } : {}) })
        socket.broadcast.emit('on-update-players', { tictactoe: this.clients.length });
    }

    removeClient(socket) {
        this.clients = this.clients.filter(client => client.id !== socket.id);
        socket.broadcast.emit('on-update-players', { tictactoe: this.clients.length });
    }

    init(db, io) {
        if (db) this.db = db;

        io.on('connection', (socket) => {

            // Titctactoe game

            socket.on('create', (data) => {
                // Get all rooms available length
                let roomId = Array.from(socket.adapter.rooms.entries()).length + 1;
                socket.roomId = `room-${roomId}`;
                createGame({ io, socket, roomId: `room-${roomId}` });
                this.addClient(socket, `room-${roomId}`)
            });
            socket.on('join', (data) => {

                if (data.roomId) {
                    joinGame({
                        io, socket, data: { roomId: data.roomId }, cb: (roomId) => {
                            console.log('callback cb ' + roomId)
                            socket.roomId = roomId
                            this.addClient(socket, roomId)
                        }
                    });
                } else {
                    joinGame({
                        io, socket, data: {}, cb: (roomId) => {
                            console.log('callback cb ' + roomId)
                            socket.roomId = roomId
                            this.addClient(socket, roomId)
                        }
                    })
                }
            });
            socket.on('concurrentInfo', (data) => {
                if (data.username) {
                    io.to(data.concurentSocketId).emit('concurrentInfo', {
                        username: data.username
                    })
                }
            })
            socket.on('on-marker', (data) => {
                const roomClients = getRoomClients(socket, data.roomId);
                if (!roomClients) return;
                const turnSid = Array.from(roomClients).filter(client => client != data?.socket?.id)[0];
                io.to(data.roomId).emit('on-marker', { marker: data.marker, sid: data?.socket?.id, turn: turnSid, from: socket?.id });
                io.to(data.roomId).emit('on-turn', { sid: turnSid })
            })

            socket.on('on-game-restart', (data) => {
                io.to(data.roomId).emit('on-game-restart', {})
            })

            socket.on('leave-room', () => {
                const finded = this.findClient(socket.id);
                if (finded) {
                    io.to(finded['roomId']).emit('on-leave-room', {
                        socketId: socket.id
                    })
                    socket.leave(finded['roomId'])
                    this.removeClient(socket);
                }
            })

            socket.on('disconnect', (raison) => {
                console.log('disconnected ' + socket.id + ' + raison : ' + raison)
                console.log('leave room on disconnect ' + socket.id + ' on room ' + socket.roomId)
                const finded = this.findClient(socket.id);
                if (finded) {
                    console.log('socket id client finded')
                    console.log(finded)
                    io.to(finded['roomId']).emit('on-leave-room', {
                        socketId: socket.id
                    })
                    socket.leave(finded['roomId'])
                    this.removeClient(socket);
                    console.log('socket id client removed')
                }
            })

        })
    }
}

module.exports = GameCtrl;