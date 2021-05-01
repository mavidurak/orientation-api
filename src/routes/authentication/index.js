import { Op } from 'sequelize';
import Joi from '../../joi';

import models from '../../models';
import { createSaltHashPassword, makeSha512 } from '../../utils/encription';

const registerSchema = {
  body: Joi.object({
    username: Joi.string()
      .min(2)
      .max(30)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .required(),
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
  }),
};

const loginSchema = {
  body: Joi.object({
    username: Joi.string()
      .min(2)
      .max(30)
      .required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .required(),
  }),
};

const login = async (req, res) => {
  const { error } = loginSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }

  const { username, password } = req.body;

  const user = await models.users.findOne({
    where: {
      username,
    },
  });

  if (user) {
    const passwordHash = makeSha512(password, user.password_salt);
    if (passwordHash === user.password_hash) {
      const token = await user.createToken(req.headers['x-forwarded-for'] || req.connection.remoteAddress);

      return res.send({ token });
    }
  }

  return res.status(401).send({
    errors: [
      {
        message: 'Username or password is incorrect!',
      },
    ],
  });
};

const register = async (req, res) => {
  const { error } = registerSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }

  const {
    username, email, password, name,
  } = req.body;

  let user = await models.users.findOne({
    where: {
      [Op.or]: {
        username: username.trim(),
        email: email.trim(),
      },
    },
  });
  if (user) {
    return res.send(400, {
      errors: [
        {
          message: 'E-mail or username is already used!',
        },
      ],
    });
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

  return res.status(201).send({
    user: user.toJSON(),
  });
};

const userInfo = async (req, res) => {
  res.send(req.user);
};

export default {
  prefix: '/authentication',
  inject: (router) => {
    router.post('/register', register);
    router.post('/login', login);
    router.get('/me', userInfo);
  },
};
