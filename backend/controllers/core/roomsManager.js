const getRoomClientsNumber = (socket, room) => {
    if (socket) {
        if (socket.adapter) {
            if (socket.adapter.rooms) {
                if (socket.adapter.rooms.get(room)) {
                    return socket.adapter.rooms.get(room).size
                } else {
                    return undefined
                }
            } else {
                return undefined
            }
        }
    }
}

const getRoomClients = (socket, room) => {
    if (socket) {
        if (socket.adapter) {
            if (socket.adapter.rooms) {
                return socket.adapter.rooms.get(room)
            }
        }
    }
};

const getRooms = (socket) => {
    if (socket) {
        if (socket.adapter) {
            if (socket.adapter.rooms) {
                return socket.adapter.rooms
            }
        }
    }
};

module.exports = {
    getRoomClientsNumber,
    getRoomClients,
    getRooms
}