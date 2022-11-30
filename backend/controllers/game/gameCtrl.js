const Core = require('../core/coreCtrl');
const { getRoomClients } = require('../core/roomsManager');
const { createGame, joinGame } = require('./tictactoe/tictactoe');

class GameCtrl extends Core {

    db = undefined;
    log = undefined;

    init(db, io) {
        if (db) this.db = db;
        
        io.on('connection', (socket) => {
            
            if (!this.log) {
                this.log = true
                setInterval(() => {
                    // console.log(getRooms(socket))
                }, 1000)
            }
            // Titctactoe game

            socket.on('create', (data) => {
                // Get all rooms available length
                let roomId = Array.from(socket.adapter.rooms.entries()).length + 1;
                socket.roomId = `room-${roomId}`;
                createGame({ io, socket, roomId: `room-${roomId}` });
            });
            socket.on('join', (data) => {

                if (data.roomId) {
                    joinGame({ io, socket, data: { roomId: data.roomId }, cb: (roomId) => {
                        console.log('callback cb ' + roomId)
                        socket.roomId = roomId
                    } });
                } else {
                    joinGame({ io, socket, data: { }, cb: (roomId) => {
                        console.log('callback cb ' + roomId)
                        socket.roomId = roomId
                    } })
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

            socket.on('leave-room', (data) => {
                console.log('leave room: ', socket.roomId)
                io.to(socket.roomId).emit('on-leave-room', {
                    socketId: socket.id
                })
                socket.leave(socket.roomId)
            })

            socket.on('disconnect', (raison) => {
                console.log('disconnected ' + socket.id + ' + raison : ' + raison)
                console.log('leave room on disconnect ' + socket.id + ' on room ' + socket.roomId)
                io.to(socket.roomId).emit('on-leave-room', {
                    socketId: socket.id
                })
                socket.leave(socket.roomId)
            })

        })
    }
}

module.exports = GameCtrl;