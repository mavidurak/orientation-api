import { Op } from 'sequelize';
import models from '../../models';
import Joi from '../../joi';

const create_validation = {
  body: Joi.object({
    community_id: Joi.number()
      .required(),
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

  const {
    header, text, is_private, community_id,
  } = req.body;
  const discussion = await models.discussions.create({
    header,
    text,
    is_private,
    user_id: req.user.id,
    community_id,
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

const getCommentsById = async (req, res) => {
  const { id } = req.params;
  try {
    const parents = await models.comments.findAll({
      where: {
        discussion_id: id,
      },
      include: {
        attributes: { exclude: ['password_hash','password_salt'] },
        model: models.users,
        as: 'user',
      },
    });

    let isLastStep = false; let
      childs = await models.comments.findAll({
        where: {
          parent_comment_id: {
            [Op.or]: parents.map((c) => c.id),
          },
        },
        include: {
          attributes: { exclude: ['password_hash','password_salt'] },
          model: models.users,
          as: 'user',
        },
      });

    // get all comment's comments
    let newComments = childs;

    while (!isLastStep) {
      newComments = await models.comments.findAll({
        where: {
          parent_comment_id: {
            [Op.or]: newComments.map((c) => c.id),
          },
        },
        include: {
          attributes: { exclude: ['password_hash','password_salt'] },
          model: models.users,
          as: 'user',
        },
      });

      if (newComments.length === 0) {
        isLastStep = true;
      } else {
        childs = [...childs, ...newComments];
      }
    }

    // sort nested comments
    let comments = [...parents, ...childs];
    /* eslint-disable-next-line no-return-assign */
    comments.forEach((c) => c.dataValues.comments = []);

    childs.forEach((child) => {
      for (let index = 0; index < comments.length; index++) {
        const element = comments[index];
        if (element.id === child.parent_comment_id) {
          comments[index].dataValues.comments.push(child);
          break;
        }
      }
    });

    comments = comments.filter((c) => !(childs.map((ch) => ch.id).includes(c.id)));

    res.send(200, { comments });
  } catch (error) {
    return res.send({
      errors: [
        {
          message: error.message,
        },
      ],
    });
  }
};

const getCommunityDiscussions = async (req, res) => {
  try {
    const { communityId } = req.params;
    const discussion = await models.discussions.findAll({
      where: {
        community_id: communityId,
      },
    });
    if (discussion.length === 0) {
      return res.send(403, {
        errors: [
          {
            message: 'Discussion not found or you don\'t have a permission!',
          },
        ],
      });
    }

    return res.send(discussion);
  } catch (error) {
    return res.send({
      errors: [
        {
          message: error.message,
        },
      ],
    });
  }
};

const getDiscussionByCommunityId = async (req, res) => {
  try {
    const { communityId, discussionId } = req.params;
    const discussion = await models.discussions.findOne({
      where: {
        id: discussionId,
        community_id: communityId,
      },
      include: [{
        model: models.communities,
        as: 'communities',
      },
      {
        attributes: { exclude: ['password_hash','password_salt'] },
        model: models.users,
        as: 'user',
      }],
    });
    if (!discussion) {
      return res.send({
        message: 'Discussion not found or you don\'t have a permission!',
      });
    }

    res.send(discussion);
  } catch (error) {
    return res.send({
      errors: [
        {
          message: error.message,
        },
      ],
    });
  }
};

export default [{
  prefix: '/discussions',
  inject: (router) => {
    router.post('', create);
    router.get('/:id', detail);
    router.put('/:id', update);
    router.delete('/:id', deleteById);
    router.get('/:id/comments', getCommentsById);
  },
},
{
  prefix: '/communites',
  inject: (router) => {
    router.get('/:communityId/discussions', getCommunityDiscussions);
    router.get('/:communityId/:discussionId', getDiscussionByCommunityId);
  },
}];
