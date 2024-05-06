const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const eCashControllers = require('./eCash-controller');
const eCashValidator = require('./eCash-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/eCash', route);

  // get list of users eCash
  route.get('/', authenticationMiddleware, eCashControllers.get_eCashs);

  // Create user eCash
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(eCashValidator.create_eCash),
    eCashControllers.create_eCash
  );

  //Get eCash detail
  route.get('/', authenticationMiddleware, eCashControllers.get_eCash);

  // Update transaction
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(eCashValidator.update_eCash),
    eCashControllers.update_eCash
  );

  //Delete Transaction
  route.delete('/:id', authenticationMiddleware, eCashControllers.delete_eCash);
};
