const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

// const { validateChangePassword } = require('./users-validator');
// const { request } = require('express');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const {
      page_number = 1,
      page_size = 10,
      sort = 'email:desc',
      search = '',
    } = request.query;

    const { sortBy, sortOrder } = sort.split(':');

    const users = await usersService.getUsers(
      parseInt(page_number),
      parseInt(page_size),
      sortBy,
      sortOrder,
      search
    );

    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const { name, email, password, password_confirm } = request.body;

    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation does not match'
      );
    }

    // Check if email is already taken
    const emailExists = await usersService.checkUserWithEmailExists(email);
    if (emailExists) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'This email is already registered'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const { id } = request.params;
    const { name, email } = request.body;

    // Check if email is already taken
    const emailExists = await usersService.checkUserWithEmailExists(email);
    if (emailExists) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'This email is already registered'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const { id } = request.params;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */

async function changePassword(request, response, next) {
  try {
    const { id } = request.params;
    const { password_new, old_password, password_confirm } = request.body;

    // Check if password confirmation matches
    if (password_new !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation does not match'
      );
    }

    // Check if old password is correct
    if (!(await usersService.checkPassword(id, old_password))) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Old password is incorrect'
      );
    }

    // Change password
    const changeSuccess = await usersService.changePassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get users with pagination and filter request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next function
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsersPaginationFilter(request, response, next) {
  try {
    const { page_number = 1, page_size = 10, search = '' } = request.query;

    const users = await usersService.getUsersPaginationFilter(
      parseInt(page_number),
      parseInt(page_size),
      search
    );

    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getUsersPaginationFilter,
};
