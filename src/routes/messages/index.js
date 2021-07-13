import models from '../../models';
import Joi from '../../joi';

const postMessagesSchema = {
  body: Joi.object({
    from: Joi.number(),
    to: Joi.number()
      .required(),
    text: Joi.string()
      .required(),
  }),
};
const getMessagesSchema = {
  body: Joi.object({
    from: Joi.number(),
    to: Joi.number()
      .required(),
    text: Joi.string(),
  }),
};
const create = async (req, res) => {
  const { error } = postMessagesSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { to, text } = req.body;
  const message = await models.messages.create({
    from: req.user.id,
    to,
    text,
  });
  return res.send(201, message);
};

const read = async (req, res) => {
  const { error } = getMessagesSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { to } = req.body;
  const { limit } = req.query;
  const messages = await models.wanted_contents.findAll({
    where: {
      from: req.user.id,
      to,
    },
    limit,
  });
  if (!messages) {
    return res.send(400, {
      errors: [
        {
          message: 'Message not found or you don\'t have a permission!',
        },
      ],
    });
  }
  res.send({ messages });
};

const deletemessage = async (req, res) => {
  const { userId } = req.params;
  const messages = await models.messages.findOne({
    where: {
      id: userId,
      from: req.user.id,
    },
  });
  if (!messages) {
    return res.status(401).send({
      errors: [
        {
          message: 'Message not found or you don\'t have a permission!',
        },
      ],
    });
  }
  await messages.destroy();
  res.send({
    message: 'Message deleted successfully from yours wanted list!',
  });
};
export default [{
  prefix: '/messages',
  inject: (router) => {
    router.post('', create);
    router.get('', read);
    router.delete('/:id', deletemessage);
  },
},
];
