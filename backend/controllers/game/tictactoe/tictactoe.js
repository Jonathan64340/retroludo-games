const { getRooms, getRoomClientsNumber, getRoomClients } = require("../../core/roomsManager");

const createGame = ({ io, socket, roomId }) => {
    if (socket) {
        socket.join(roomId);
        io.to(socket.id).emit('on-create', { roomId, url: `http://localhost:3000/tictactoe?roomId=${roomId}` });
        io.to(roomId).emit('room-info', { sids: [socket.id], roomId });
    }
}

const joinGame = async ({ io, socket, data }) => {
    const rooms = getRooms(socket);
    const roomId = data && data.roomId ? data.roomId : undefined

    console.log(data)
    if (!roomId) {

        for (let room of rooms) {

            const roomName = room[0] || '';
            const roomPlayerLength = Array.from(room[1]).length;

            if (await roomName.match('room-') && roomPlayerLength < 2) {
                console.log(roomName)

                await socket.join(roomName);
                socket.roomId = roomName;
                await io.to(socket.id).emit('on-join', { roomId: roomName });

                const sids = getRoomClients(socket, roomName);
                io.to(roomName).emit('room-info', {
                    sids: [...sids],
                    roomId: roomName
                })
                io.to(roomName).emit('on-game-ready', { sid: [...sids][Math.floor(Math.random() * [...sids].length)] })

            }
        }
    }

    if (socket && roomId && typeof getRoomClientsNumber(socket, roomId) !== 'undefined' && getRoomClientsNumber(socket, roomId) < 2) {
        socket.join(roomId);
        socket.roomId = roomId;
        io.to(socket.id).emit('on-join', { roomId });
        setTimeout(() => {
            const sids = getRoomClients(socket, roomId);
            io.to(roomId).emit('room-info', {
                sids: [...sids],
                roomId
            })
            io.to(roomId).emit('on-game-ready', { sid: [...sids][Math.floor(Math.random() * [...sids].length)] })
        }, 1000)

    } else {
        io.to(socket.id).emit('on-join-error', { message: 'Unable to connect to this game!' });
    }
}

module.exports = {
    createGame,
    joinGame
}