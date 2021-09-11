import { Op } from 'sequelize';

import models from '../models';
import HTTPError from '../exceptions/HTTPError';
import { createSaltHashPassword, makeSha512 } from '../utils/encription';

const getUser = async (usernameOrId) => {
  const inputType = typeof usernameOrId === 'string' ? 'username' : 'id';
  const user = await models.users.findOne({
    where: {
      [inputType]: usernameOrId,
    },
  });
  return user;
};

const createUser = async (username, email, password, name) => {
  let user = await models.users.findOne({
    where: {
      [Op.or]: {
        username: username.trim(),
        email: email.trim(),
      },
    },
  });

  if (user) {
    throw new HTTPError('E-mail or username is already used!', 400);
  }

  const {
    hash: password_hash,
    salt: password_salt,
  } = createSaltHashPassword(password);

  user = await models.users.create({
    username,
    email,
    name,
    password_hash,
    password_salt,
  });

  return user;
};

const updateUser = async ({
  password, username, email, name, friends_ids, new_password, new_password_again,
}, id) => {
  const user = await getUser(id);

  if (user) {
    const passwordHash = makeSha512(password, user.password_salt);
    if (passwordHash !== user.password_hash) {
      throw new HTTPError('Password is incorrect please try again', 403);
    }
    let where = {};
    if (username || email) {
      where = username ? { username } : { email };
      const isExist = await models.users.findOne({
        where,
      });
      if (isExist) {
        throw new HTTPError('E-mail or username is already used!', 403);
      }
    }
    let passwordValdation = { hash: null, salt: null };
    if (new_password && new_password_again) {
      if (new_password !== new_password_again) {
        throw new HTTPError('Passwords must be same!', 403);
      }
      passwordValdation = createSaltHashPassword(new_password);
    }
    /* eslint-disable no-return-assign */
    where = Object.entries({
      username,
      email,
      name,
      friends_ids,
      password_hash: passwordValdation.hash,
      password_salt: passwordValdation.salt,
    }).reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {});
    const updatedUser = await user.update(where);
    return updatedUser.toJSON();
  }
};

const deleteUser = async (id) => {
  const isDeleted = await models.users.destroy({
    where: {
      id,
    },
  });
  return isDeleted;
};

const UserService = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
};

export default UserService;
