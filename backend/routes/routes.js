
const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid').v4();

const _io = require('../socket/socket.class');
const _game = require('../controllers/game/gameCtrl');
const _core = require('../controllers/core/coreCtrl');
const _auth = require('../controllers/auth/authCtrl');
const Game = new _game();
const Auth = new _auth();
const Core = new _core();

let socket = null;

const init = (db, io) => {
  if (io) socket = io;

  // Define socket
  new _io().init(db, io);

  Game.init(db, io);
  // Now we can use like socket.emit('source', data);
}

// Create game 
router.post('/api/v1/createGame', Core.authenticateJWT, (req, res) => {
  return Game.createGame({ ...req.body })
    .then(game => res.send(game))
    .catch(() => res.sendStatus(500));
});

// Join game 
router.post('/api/v1/joinGame', Core.authenticateJWT, (req, res) => {
  return Game.joinGame({ ...req.body })
    .then(game => res.send(game))
    .catch(() => res.sendStatus(500));
});

// Auth
router.post('/api/v1/auth/authenticate', (req, res) => {
  return Auth.authenticate()
    .then(user => res.send(user))
    .catch(() => res.sendStatus(500));
});

router.post('/api/v1/auth/refreshToken', (req, res, next) => {
  Core.authenticateRefreshToken(req, res, next)
    .then(async accessToken => {
      res.send({ accessToken: await accessToken.accessToken })
    })
    .catch(() => res.sendStatus(500));
});

module.exports.init = init;
module.exports.router = router;