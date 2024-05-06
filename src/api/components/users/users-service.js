const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @param {number} pageNumber - Page number
 * @param {number} pageSize - Page size
 * @param {string} search - Search query in format "field:substring"
 * @param {string} sort - Sort query in format "field:order"
 * @returns {Array} - Array of users
 */
async function getUsers(pageNumber, pageSize, search, sort) {
  const users = await usersRepository.getUsers();

  let filteredUsers = users;
  if (search) {
    const { field, substring } = search.split(':');
    const searchKey = substring.toLowerCase();
    if (field === 'email') {
      filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchKey)
      );
    } else if (field === 'name') {
      filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchKey)
      );
    }
  }

  let sortField = 'email';
  let sortOrder = 1;
  if (sort) {
    const { field, order } = sort.split(':');
    sortField = field;
    sortOrder = order === 'asc' ? 1 : -1;

    //sorting filteredUsers
    filteredUsers.sort((a, b) => {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      if (sortField === 'email') {
        for (let i = 0; i < Math.min(aValue.length, bValue.length); i++) {
          if (aValue.charCodeAt(i) !== bValue.charCodeAt(i)) {
            return sortOrder * (aValue.charCodeAt(i) - bValue.charCodeAt(i));
          }
        }
        
        // If values are the same up to the end, order by email length
        return sortOrder * (aValue.length - bValue.length);
      } else {
        // For other columns, use default sorting
        if (aValue < bValue) return sortOrder === 1 ? -1 : 1;
        if (aValue > bValue) return sortOrder === 1 ? 1 : -1;
        return 0;
      }
    });
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = pageNumber * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const formattedUsers = paginatedUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: paginatedUsers.length,
    total_pages: Math.ceil(filteredUsers.length / pageSize),
    has_previous_page: pageNumber > 1,
    has_next_page: endIndex < filteredUsers.length,
    data: formattedUsers,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object|null} - User object or null if user not found
 */

async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean|null} - true if user created successfully, null if creation fails
 */

async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */

async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */

async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} email - Email
 * @returns {boolean}
 */

//Check users with email
async function checkUserWithEmailExists(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check Password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change Password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */

//change password
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // check if User not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSucces = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSucces) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkUserWithEmailExists,
  changePassword,
  checkPassword,
};
