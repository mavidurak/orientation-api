import { Op } from 'sequelize';
import Joi from '../../joi';
import { EMAIL_TOKEN_STATUS } from '../../constants/email';
import { sendEmail } from '../../utils/sendEmail';

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

const updateSchema = {
  body: Joi.object({
    username: Joi.string()
      .min(2)
      .max(30),
    email: Joi.string()
      .email(),
    password: Joi.string()
      .min(8)
      .max(30)
      .required(),
    name: Joi.string()
      .min(2)
      .max(30),
    friends_ids: Joi.array(),
    new_password: Joi.string().min(8),
    new_password_again: Joi.string().min(8),
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
      if (!user.is_email_confirmed) {
        return res.send(401, {
          errors: [
            {
              message: 'This account has not been confirmed yet.',
            },
          ],
        });
      }
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

  const value = await user.createEmailConfirmationToken();
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    user.is_email_confirmed = true;
    await user.save();
  } else {
    await sendEmail(user, {
      subject: 'Welcome to MaviDurak-IO',
    }, {
      username: user.name,
      href: `${process.env.API_PATH}/authentication/email-confirmation?token=${value}`,
    });
  }

  return res.status(201).send({
    user: user.toJSON(),
  });
};

const userInfo = async (req, res) => {
  res.send(req.user);
};

const update = async (req, res) => {
  const { error, value } = updateSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const {
    password, username, email, name, friends_ids, new_password, new_password_again,
  } = req.body;
  const user = await models.users.findOne({
    where: {
      username: req.user.username,
    },
  });

  if (user) {
    const passwordHash = makeSha512(password, user.password_salt);
    if (passwordHash !== user.password_hash) {
      return res.send(403, {
        errors: [
          {
            message: 'password is incorrect please try again ',
          },
        ],
      });
    }
    let where = {};
    if (username || email) {
      where = username ? { username } : { email };
      const isExist = await models.users.findOne({
        where,
      });
      if (isExist) {
        return res.send(403, {
          errors: [
            {
              message: 'E-mail or username is already used!',
            },
          ],
        });
      }
    }
    let passwordValdation = { hash: null, salt: null };
    if (new_password && new_password_again) {
      if (new_password !== new_password_again) {
        return res.send(403, {
          errors: [
            {
              message: 'Passwords must be same!',
            },
          ],
        });
      }
      passwordValdation = createSaltHashPassword(new_password);
    }
    where = Object.entries({
      username, email, name, friends_ids, password_hash: passwordValdation.hash, password_salt: passwordValdation.salt,
    }).reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {});
    const user2 = await user.update(where);
    return res.send(user2.toJSON());
  }
};

const deleteUser = async (req, res) => {
  const isDeleted = await models.users.destroy({
    where: {
      id: req.user.id,
    },
  });
  if (isDeleted) {
    res.send(200, {
      message: 'Successfully deleted',
    });
  }
};

const emailConfirmation = async (req, res) => {
  const value = req.query.token;
  const emailConfirmationValue = await models.email_confirmation_tokens.findOne({
    where: {
      value,
      status: EMAIL_TOKEN_STATUS.PENDING,
    },
  });

  if (emailConfirmationValue) {
    await emailConfirmationValue.confirmEmail();
  }

  return res.redirect(`${process.env.FRONTEND_PATH}/login`);
};

export default {
  prefix: '/authentication',
  inject: (router) => {
    router.post('/register', register);
    router.post('/login', login);
    router.get('/me', userInfo);
    router.put('/me', update);
    router.delete('/me', deleteUser);
    router.get('/email-confirmation', emailConfirmation);
  },
};
