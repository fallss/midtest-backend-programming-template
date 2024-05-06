const { eCash } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function get_eCashs() {
  return eCash.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function get_eCash(id) {
  return eCash.findById(id);
}

/**
 * Create new eCash
 * @param {string} name - nama akun
 * @param {number} phoneNumber - no hp
 * @param {string} pin - Kata Sandi
 * @param {string} accountType - Jenis Akun
 * @returns {Promise}
 */
async function create_eCash(name, phoneNumber, pin, accountType) {
  return eCash.create({
    name,
    phoneNumber,
    accountType,
    pin,
  });
}

/**
 * Update existing eCash
 * @param {string} id - User ID
 * @param {string} phoneNumber - no hp
 * @param {string} pin - kata sandi
 * @returns {Promise}
 */
async function update_eCash(id, phoneNumber, pin) {
  return eCash.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        phoneNumber,
        pin,
      },
    }
  );
}

/**
 * Delete a transaction
 * @param {string} id - Transaction ID
 * @returns {Promise}
 */
async function delete_eCash(id) {
  return eCash.deleteOne({ _id: id });
}

module.exports = {
  create_eCash,
  get_eCash,
  get_eCashs,
  update_eCash,
  delete_eCash,
};
