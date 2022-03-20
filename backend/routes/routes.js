
const express = require('express');
const router = express.Router();

const _io = require('../socket/socket.class');
let socket = null;

const init = (db, io) => {
  if (io) socket = io;

  // Define socket
  new _io().init(db, io);

  // Now we can use like socket.emit('source', data);
}

module.exports.init = init;
module.exports.router = router;