const Core = require('../core/coreCtrl');
const uuid = require('uuid');

class AuthCtrl extends Core {

    db = undefined;
    io = undefined;

    init(db, io) {
        if (db) this.db = db;
        if (io) this.io = io;
    }

    async authenticate() {
        return new Promise(async (resolve) => {
            const token = await this.jwtEncode({ "_id:": uuid.v4() });
            const refreshToken = await this.generateRefreshToken({ "_id:": uuid.v4() });
            return resolve({ accessToken: token, refreshToken, "user": uuid.v4() });
        })
    }
}

module.exports = AuthCtrl;