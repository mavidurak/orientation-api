import models from '../../models';
import Joi from '../../joi';

const create_validation = {
  body: Joi.object({
    header: Joi.string()
      .required(),
    text: Joi.string()
      .required(),
    is_private: Joi.boolean(),
  }),
};
const update_validation = {
  body: Joi.object({
    header: Joi.string(),
    text: Joi.string(),
    is_private: Joi.boolean(),
  }),
};

const create = async (req, res) => {
  const { error } = create_validation.body.validate(req.body);

  if (error) {
    return res.send(400,
      {
        errors: error.details,
      });
  }

  const { header, text, is_private } = req.body;
  const discussion = await models.discussions.create({
    header,
    text,
    is_private,
    user_id: req.user.id,
  });
  return res.status(201).send({
    discussion,
  });
};

const detail = async (req, res) => {
  const { id } = req.params;

  try {
    const discussion = await models.discussions.findOne({
      where: {
        id,
      },
    });

    if (!discussion) {
      return res.send({
        errors: [
          {
            message: 'Discussion not found or you don\'t have a permission!',
          },
        ],
      });
    }
    return res.send(discussion);
  } catch (err) {
    return res.status(500).send({
      errors: [
        {
          message: err.message,
        },
      ],
    });
  }
};

const update = async (req, res) => {
  const { error } = update_validation.body.validate(req.body);

  if (error) {
    return res.send(400,
      {
        errors: error.details,
      });
  }

  const { id } = req.params;
  const discussion = await models.discussions.findOne({
    where: {
      id,
      user_id: req.user.id,
    },
  });
  if (!discussion) {
    return res.send({
      errors: [
        {
          message: 'Discussion not found or you don\'t have a permission!',
        },
      ],
    });
  }
  const { header, text, is_private } = req.body;
  const updated = await models.discussions.update({ header, text, is_private },
    {
      where: {
        id: discussion.id,
      },
    });

  if (!updated) {
    return res.send({
      errors: [
        {
          message: 'Some error occurred while updating discussions.',
        },
      ],
    });
  }
  res.send({
    message: 'Discussion updated successfully!',
  });
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  try {
    const discussion = await models.discussions.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!discussion) {
      return res.send({
        errors: [
          {
            message: 'Discussion not found or you don\'t have a permission!',
          },
        ],
      });
    }
    const isDeleted = await models.discussions.destroy({
      where: {
        id,
      },
    });

    if (!isDeleted) {
      res.send({
        message: 'Discussion not found or you don\'t have a permission!',
      });
    }
    res.send({
      message: 'Discussion deleted successfully!',
    });
  } catch (err) {
    return res.status(500).send({
      errors: [
        {
          message: err.message,
        },
      ],
    });
  }
};

export default {
  prefix: '/discussions',
  inject: (router) => {
    router.post('', create);
    router.get('/:id', detail);
    router.put('/:id', update);
    router.delete('/:id', deleteById);
  },
};
