const Core = require('../core/coreCtrl');

class GameCtrl extends Core {

    db = undefined;
    io = undefined;

    init(db, io) {
        if (db) this.db = db;
        if (io) this.io = io;
    }
}

module.exports = GameCtrl;