import models from '../../models';
import UserService from '../../services/user';
import { sendEmail } from '../../utils/sendEmail';
import { makeSha512, createSaltHashPassword } from '../../utils/encription';
import Joi from '../../joi';
import HTTPError from '../../exceptions/HTTPError';

import { EMAIL_TOKEN_STATUS, EMAIL_TYPES } from '../../constants/email';

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

const resetPasswordSchema = {
  body: Joi.object({
    password: Joi.string()
      .min(8)
      .max(30)
      .required(),
  }),
};

const login = async (req, res, next) => {
  const { error } = loginSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { username, password } = req.body;

  try {
    const user = await UserService.getUser(username);

    if (user) {
      const passwordHash = makeSha512(password, user.password_salt);
      if (passwordHash === user.password_hash) {
        if (!user.is_email_confirmed) {
          throw new HTTPError('This account has not been confirmed yet.', 401);
        }

        const token = await user.createToken(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        return res.send({ token });
      }
    }

    throw new HTTPError('Username or password is incorrect!', 401);
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  const { error } = registerSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }

  const {
    username, email, password, name,
  } = req.body;
  try {
    const user = await UserService.createUser(username, email, password, name);

    const value = await user.createEmailConfirmationToken(EMAIL_TYPES.EMAIL_VALIDATION);
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      user.is_email_confirmed = true;
      await user.save();
    } else {
      await sendEmail(user, {
        subject: 'Welcome to MaviDurak-IO',
        emailType: EMAIL_TYPES.EMAIL_VALIDATION,
      }, {
        username: user.name,
        href: `${process.env.API_PATH}/authentication/email-confirmation?token=${value}`,
      });
    }

    return res.status(201).send({
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

const userInfo = async (req, res) => {
  res.send(req.user);
};

const update = async (req, res, next) => {
  const { error } = updateSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }

  try {
    const user = await UserService.updateUser({ ...req.body }, req.user.id);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res) => {
  const isDeleted = await UserService.deleteUser(req.user.id);
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
    await emailConfirmationValue.confirmToken();
  }

  return res.redirect(`${process.env.FRONTEND_PATH}/login`);
};

const sendForgotPasswordEmail = async (req, res, next) => {
  try {
    const user = await models.users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      throw new HTTPError('User not found!', 401);
    }

    const value = await user.createEmailConfirmationToken(EMAIL_TYPES.FORGOT_PASSWORD);
    await sendEmail(user, {
      subject: 'Reset your password',
      emailType: EMAIL_TYPES.FORGOT_PASSWORD,
    }, {
      username: user.name,
      href: `${process.env.FRONTEND_PATH}/reset-password?token=${value}`,
    });

    res.send(200);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { error } = resetPasswordSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }

  const value = req.query.token;
  const { password } = req.body;
  try {
    const resetPasswordToken = await models.email_confirmation_tokens.findOne({
      where: {
        value,
        type: EMAIL_TYPES.FORGOT_PASSWORD,
        status: EMAIL_TOKEN_STATUS.PENDING,
      },
    });

    if (resetPasswordToken) {
      const user = await UserService.getUser(resetPasswordToken.user_id);

      const {
        hash: password_hash,
        salt: password_salt,
      } = createSaltHashPassword(password);
      user.password_hash = password_hash;
      user.password_salt = password_salt;

      await user.save();
      await resetPasswordToken.confirmToken();

      return res.send(200, {
        message: 'Your password has been successfully changed.',
      });
    }

    throw new HTTPError('You do not have permission to change password!', 401);
  } catch (err) {
    next(err);
  }
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
    router.post('/forgot-password', sendForgotPasswordEmail);
    router.post('/reset-password', resetPassword);
  },
};
