import Joi from '../../joi';
import models from '../../models';

const createContentSchema = {
  body: Joi.object({
    name: Joi.string()
      .max(50)
      .required(),
    type: Joi.string()
      .required(),
    description: Joi.string()
      .max(250)
      .required(),
    image_path: Joi.string()
      .required(),
  }),
};
const updateContentSchema = {
  body: Joi.object({
    name: Joi.string()
      .max(50),
    type: Joi.string()
      .min(0)
      .max(10),
    description: Joi.string()
      .max(250),
    image_path: Joi.string()
      .max(250),
  }),
};

const create = async (req, res) => {
  const { error } = createContentSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const {
    name, type, description, image_path,
  } = req.body;
  const image = await models.images.create({
    user_id: req.user.id,
    name: image_path,
    path: image_path,
  });
  const content = await models.contents.create({
    user_id: req.user.id,
    name,
    type,
    description,
    image_id: image.id,
  });
  res.send({
    content,
  });
};

const detail = async (req, res) => {
  const { slug } = req.params;
  try {
    const content = await models.contents.findOne({
      where: {
        slug,
      },
      include: [
        {
          model: models.images,
          as: 'image',
        },
        {
          attributes: { exclude: ['password_hash','password_salt'] },
          model: models.users,
          as: 'user',
        },
      ],
    });

    if (!content) {
      return res.send({
        errors: [
          {
            message: 'Content not found or you don\'t have a permission!',
          },
        ],
      });
    }
    content.views += 1;
    await content.save();
    return res.send(content);
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

const getContents = async (req, res) => {
  const { limit } = req.query;
  const contents = await models.contents.findAll({
    limit,
    include: {
      model: models.images,
      as: 'image',
    },
  });
  return res.send({ contents, count: contents.length });
};

const update = async (req, res) => {
  const { error } = updateContentSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { slug } = req.params;
  try {
    const content = await models.contents.findOne({
      where: {
        slug,
      },
      include: {
        model: models.users,
        as: 'user',
        where: {
          id: req.user.id,
        },
      },
    });
    if (!content) {
      return res.status(403).send({
        errors: [
          {
            message: 'Content not found or you don\'t have a permission!',
          },
        ],
      });
    }

    const {
      name, type, description, image_path,
    } = req.body;
    models.contents.update({
      name, type, description, image_path,
    }, {
      where: {
        slug,
      },
    });
    res.send({
      message: 'Content was updated succesfully',
    });
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          message: err.message,
        },
      ],
    });
  }
};

const deleteContent = async (req, res) => {
  const { slug } = req.params;
  const user_id = req.user.id;
  const content = await models.contents.findOne({
    where: {
      slug,
      user_id,
    },
  });
  if (!content) {
    res.status(401).send({
      errors: [
        {
          message: 'Content not found or you don\'t have a permission!',
        },
      ],
    });
  }
  await models.contents.destroy({
    where: {
      slug,
    },
  });
  res.send({
    message: 'Content was delected successfully!',
  });
};

export default {
  prefix: '/contents',
  inject: (router) => {
    router.get('', getContents);
    router.post('/', create);
    router.get('/:slug', detail);
    router.put('/:slug', update);
    router.delete('/:slug', deleteContent);
  },
};
