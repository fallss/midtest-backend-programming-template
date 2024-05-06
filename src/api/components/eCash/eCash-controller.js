const eCashService = require('./eCash-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle create eCash request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */
async function create_eCash(request, response, next) {
  try {
    const { name, phoneNumber, pin, accountType, Deposit } = request.body;

    // registrasi Account dan membuat rekening bank
    const success = await eCashService.create_eCash(
      name,
      phoneNumber,
      pin,
      accountType,
      Deposit
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create Account eCash'
      );
    }

    // Mengembalikan respons dengan pesan sukses
    return response
      .status(200)
      .json({ message: 'Bank account created successfully' });
  } catch (error) {
    // Mengirimkan error ke middleware error handling
    return next(error);
  }
}

/**
 * Handle get list of eCashs request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */

async function get_eCashs(request, response, next) {
  try {
    const eCash = await eCashService.get_eCashs();
    return response.status(200).json(eCash);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get eCash detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */
async function get_eCash(request, response, next) {
  try {
    const eCash = await eCashService.get_eCash(request.params.id);

    if (!eCash) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown eCash');
    }

    return response.status(200).json(eCash);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update eCash request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function update_eCash(request, response, next) {
  try {
    const id = request.params.id;
    const { phoneNumber, pin } = request.body;

    const success = await eCashService.update_eCash(id, phoneNumber, pin);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update account information'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete eCash request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function delete_eCash(request, response, next) {
  try {
    const id = request.params.id;

    // Panggil service untuk menghapus akun eCash
    const success = await eCashService.delete_eCash(id);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete eCash'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create_eCash,
  get_eCash,
  get_eCashs,
  update_eCash,
  delete_eCash,
};
