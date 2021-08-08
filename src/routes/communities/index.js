import Joi from '../../joi';
import models from '../../models';

const createCommunitySchema = {
  body: Joi.object({
    organizers: Joi.array()
      .required(),
    members: Joi.array()
      .required(),
    name: Joi.string()
      .max(50)
      .required(),
    content_types: Joi.string()
      .required(),
    description: Joi.string()
      .max(250)
      .required(),
    image_path: Joi.string(),
    tags: Joi.array(),
    website: Joi.string(),
    rules: Joi.string()
      .required(),
  }),
};
const updateCommunitySchema = {
  body: Joi.object({
    organizers: Joi.array(),
    members: Joi.array(),
    name: Joi.string()
      .max(50),
    content_types: Joi.string(),
    description: Joi.string()
      .max(250),
    image_path: Joi.string(),
    tags: Joi.array(),
    website: Joi.string(),
    rules: Joi.string(),
  }),
};

const create = async (req, res) => {
  const { error } = createCommunitySchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const {
    organizers, members, name, content_types, description, image_path, tags, website, rules,
  } = req.body;
  const image = await models.images.create({
    user_id: req.user.id,
    name: image_path,
    path: image_path,
  });
  const community = await models.communities.create({
    organizers,
    members,
    name,
    content_types,
    description,
    image_id: image.id,
    tags,
    website,
    rules,
  });
  res.send({
    community,
  });
};

const detail = async (req, res) => {
  const { id } = req.params;
  try {
    const community = await models.communities.findOne({
      where: {
        id,
      },
      include: [
        {
          model: models.images,
          as: 'image',
        },
      ],
    });

    if (!community) {
      return res.send({
        errors: [
          {
            message: 'Community not found or you don\'t have a permission!',
          },
        ],
      });
    }
    return res.send(community);
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

const getCommunities = async (req, res) => {
  const { limit } = req.query;
  const community = await models.communities.findAll({
    limit,
    include: {
      model: models.images,
      as: 'image',
    },
  });
  return res.send({ community, count: community.length });
};

const update = async (req, res) => {
  const { error } = updateCommunitySchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { id } = req.params;
  try {
    const community = await models.communities.findOne({
      where: {
        id,
      },
    });
    if (!community || !community.organizers.includes(req.user.id)) {
      return res.status(403).send({
        errors: [
          {
            message: 'Community not found or you don\'t have a permission!',
          },
        ],
      });
    }

    const {
      organizers, members, name, image_path, content_types, description, tags, website, rules,
    } = req.body;
    let image_id;
    if (image_path) {
      const image = await models.images.create({
        user_id: req.user.id,
        name: image_path,
        path: image_path,
      });
      image_id = image.id;
    }
    console.log(image_id);
    await models.communities.update({
      organizers,
      members,
      name,
      image_id,
      members,
      content_types,
      description,
      tags,
      website,
      rules,
    }, {
      where: {
        id: community.id,
      },
    });
    res.send({
      message: 'Community was updated succesfully',
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

const deleteCommunity = async (req, res) => {
  const { id } = req.params;
  const community = await models.communities.findOne({
    where: {
      id,
    },
  });
  if (!community || !community.organizers.includes(req.user.id)) {
    return res.status(401).send({
      errors: [
        {
          message: 'Community not found or you don\'t have a permission!',
        },
      ],
    });
  }
  await models.communities.destroy({
    where: {
      id,
    },
  });
  res.send({
    message: 'Community was delected successfully!',
  });
};

export default {
  prefix: '/communities',
  inject: (router) => {
    router.get('', getCommunities);
    router.post('/', create);
    router.get('/:id', detail);
    router.put('/:id', update);
    router.delete('/:id', deleteCommunity);
  },
};
