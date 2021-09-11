import HTTPError from '../../exceptions/HTTPError';
import Joi from '../../joi';
import models from '../../models';

const createCommunitySchema = {
  body: Joi.object({
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
    name, content_types, description, image_path, tags, website, rules,
  } = req.body;
  const image = await models.images.create({
    user_id: req.user.id,
    name: image_path,
    path: image_path,
  });
  const community = await models.communities.create({
    organizers: [req.user.id],
    members: [req.user.id],
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
  const { slug } = req.params;
  try {
    const community = await models.communities.findOne({
      where: {
        slug,
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
    community.am_i_member = community.members.includes(req.user.id);
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
  const communities = await models.communities.findAll({
    limit,
    include: {
      model: models.images,
      as: 'image',
    },
  });
  communities.forEach(c => c.dataValues.am_i_member = c.members.includes(req.user.id));
  return res.send({ communities, count: communities.length });
};

const update = async (req, res) => {
  const { error } = updateCommunitySchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { slug } = req.params;
  try {
    const community = await models.communities.findOne({
      where: {
        slug,
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
    await models.communities.update({
      organizers,
      members,
      name,
      image_id,
      content_types,
      description,
      tags,
      website,
      rules,
    }, {
      where: {
        slug,
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
  const { slug } = req.params;
  const community = await models.communities.findOne({
    where: {
      slug,
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
      slug,
    },
  });
  res.send({
    message: 'Community was delected successfully!',
  });
};

const join = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const community = await models.communities.findOne({
      where: {
        slug,
      },
    });

    if (!community) {
      throw new HTTPError('Community not found!', 404);
    }
    if (community.members.includes(req.user.id)) {
      throw new HTTPError('You are already join this community', 400);
    }

    community.members = [...community.members, req.user.id];
    await community.save();
    return res.status(200).send(community);
  } catch (error) {
    next(error);
  }
};
const leave = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const community = await models.communities.findOne({
      where: {
        slug,
      },
    });

    if (!community) {
      throw new HTTPError('Community not found!', 404);
    }
    if (!community.members.includes(req.user.id)) {
      throw new HTTPError('You are not member of this community', 400);
    }

    community.members = community.members.filter((id) => id !== req.user.id);
    await community.save();

    return res.status(200).send(community);
  } catch (error) {
    next(error);
  }
};

export default {
  prefix: '/communities',
  inject: (router) => {
    router.get('', getCommunities);
    router.post('/', create);
    router.get('/:slug', detail);
    router.put('/:slug', update);
    router.delete('/:slug', deleteCommunity);
    router.get('/:slug/join', join);
    router.get('/:slug/leave', leave);
  },
};
