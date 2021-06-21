/* eslint-disable import/extensions */
import handlers from './handlers/index.js';

const router = {
  '/ping': handlers.ping,
  '/users': handlers.users,
};

export default router;
