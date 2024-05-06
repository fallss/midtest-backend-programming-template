const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// Objek untuk melacak jumlah upaya login yang gagal beserta waktu terakhirnya
const failedLoginAttempts = {};

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if there is a failed login attempt record for this email
    if (failedLoginAttempts[email] && failedLoginAttempts[email].count >= 5) {
      // Check if 30 minutes have passed since the last failed attempt
      const lastAttemptTime = failedLoginAttempts[email].time;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastAttemptTime;

      if (timeDiff <= 30 * 60 * 1000) {
        // 30 minutes
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many failed login attempts. Please try again later.'
        );
      } else {
        // Reset failed login attempt counter
        delete failedLoginAttempts[email];
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Increment failed login attempts counter for this email
      if (!failedLoginAttempts[email]) {
        failedLoginAttempts[email] = { count: 1, time: Date.now() };
      } else {
        failedLoginAttempts[email].count++;
        failedLoginAttempts[email].time = Date.now();
      }

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    } else {
      // Reset failed login attempts counter upon successful login
      delete failedLoginAttempts[email];
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
