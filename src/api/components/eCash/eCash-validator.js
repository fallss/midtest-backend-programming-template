const joi = require('joi');
const { update_eCash } = require('./eCash-repository');

module.exports = {
  create_eCash: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      phoneNumber: joi.string().required().label('phone Number'),
      pin: joi.string().required().label('Password confirmation'),
      accountType: joi.string().required().label('Tipe account'),
      Deposit: joi.number().required().label('deposit'),
    },
  },

  update_eCash: {
    body: {
      phoneNumber: joi.string().required().label('phone Number'),
      pin: joi.string().required().label('Password confirmation'),
    },
  },
};
