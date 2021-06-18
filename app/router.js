const handlers = require('./handlers');

const router = {
  '/ping': handlers.ping,
  '/users': handlers.users,
};

module.exports = router;
