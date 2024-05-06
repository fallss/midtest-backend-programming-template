const { Deposit } = require('../../../models/eCash-schema');
const eCashRepository = require('./eCash-repository');

/**
 * Create new eCash
 * @param {string} name - Nama akun
 * @param {number} phoneNumber - Nomor HP
 * @param {string} pin - Kata Sandi
 * @param {string} accountType - Jenis Akun
 * @returns {Promise}
 */
async function create_eCash(name, phoneNumber, pin, accountType) {
  try {
    await eCashRepository.create_eCash(
      name,
      phoneNumber,
      pin,
      accountType,
    );
  } catch (err) {
    return null;
  }
  return true; // Account creation successful
}

/**
 * Get a list of eCash
 * @returns {Array}
 */
async function get_eCashs() {
  const eCashs = await eCashRepository.get_eCashs();

  const results = [];
  for (let i = 0; i < eCashs.length; i += 1) {
    const eCash = eCashs[i];
    results.push({
      id: eCash.id,
      name: eCash.name,
      phoneNumber: eCash.phoneNumber,
      pin: eCash.pin,
      accountType: eCash.accountType,
    });
  }

  return results;
}

/**
 * Get eCash detail
 * @param {string} id - eCash ID
 * @returns {Promise}
 */
async function get_eCash(id) {
  const eCash = await eCashRepository.get_eCash(id);

  // User not found
  if (!eCash) {
    return null;
  }

  return {
    id: eCash.id,
    name: eCash.name,
    phoneNumber: eCash.phoneNumber,
    pin: eCash.pin,
    
};
}

/**
 * Update existing eCash
 * @param {string} id - User ID
 * @param {string} phoneNumber - no hp
 * @param {string} pin - kata sandi
 * @returns {Promise}
 */
async function update_eCash(id, phoneNumber, pin) {
  const eCash = await eCashRepository.get_eCash(id);

  // User not found
  if (!eCash) {
    return null;
  }

  try {
    await eCashRepository.update_eCash(id, phoneNumber, pin);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete a eCash
 * @param {string} id - eCash ID
 * @returns {Promise}
 */
async function delete_eCash(id) {
  const eCash = await eCashRepository.get_eCash(id);

  // User not found
  if (!eCash) {
    return null;
  }

  try {
    await eCashRepository.delete_eCash(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  create_eCash,
  get_eCash,
  get_eCashs,
  update_eCash,
  delete_eCash,
};
