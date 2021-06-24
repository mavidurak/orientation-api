import { Op } from 'sequelize';
import Joi from '../../joi';

import models from '../../models';

const createCommentSchema = {
  body: Joi.object({
    content_review_id: Joi.number(),
    discussion_id: Joi.number(),
    parent_comment_id: Joi.number(),
    text: Joi.string()
      .max(250)
      .required(),
    is_spoiler: Joi.boolean()
  }),
};


const createComment = async (req, res) => {
  const { error } = createCommentSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const{
    text,content_review_id,discussion_id,parent_comment_id,is_spoiler
  }=req.body;

  const comment = await models.comments.create({
    user_id: req.user.id,
    text,
    content_review_id,
    discussion_id,
    parent_comment_id,
    is_spoiler
  });
  res.send({
    comment
  })
}


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
  prefix: '/comments',
  inject: (router) => {
    router.post('', createComment);
    router.put('/:id', register);
    router.delete('/:id', login);
  },
};
