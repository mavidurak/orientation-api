import { Op } from 'sequelize';
import models from '../../models';
import Joi from '../../joi';
import DiscussionService from '../../services/discussion';

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

const create = async (req, res, next) => {
  const { error } = create_validation.body.validate(req.body);

  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  try {
    const {
      header, text, is_private, community_id,
    } = req.body;

    const discussion = await DiscussionService.createDiscussion({
      header, text, is_private, community_id,
    }, req.user.id);

    res.status(200).send({
      discussion,
    });
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const discussion = await DiscussionService.getDiscussion(slug);
    res.send({ discussion });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  const { error } = update_validation.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { slug } = req.params;
  try {
    const discussion = await DiscussionService.updateDiscussion({ ...req.body }, slug, req.user.id);
    res.status(200).send({ discussion });
  } catch (err) {
    next(err);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { slug } = req.params;
    await DiscussionService.deleteDiscussion(slug, req.user.id);
    return res.send(200, {
      message: 'Discussion deleted successfully!',
    });
  } catch (error) {
    next(error);
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

const getCommunityDiscussions = async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const discussions = await DiscussionService.getCommunityDiscussions(communityId);
    res.send({ discussions });
  } catch (err) {
    next(err);
  }
};

const getDiscussionByCommunityId = async (req, res, next) => {
  try {
    const { communityId, slug } = req.params;
    // eslint-disable-next-line max-len
    const discussion = await DiscussionService.getDiscussionByCommunityId(communityId, slug);
    res.send({ discussion });
  } catch (err) {
    next(err);
  }
};

export default [{
  prefix: '/discussions',
  inject: (router) => {
    router.post('', create);
    router.get('/:slug', detail);
    router.put('/:slug', update);
    router.delete('/:slug', deleteById);
    router.get('/:slug/comments', getCommentsById);
  },
},
{
  prefix: '/communities',
  inject: (router) => {
    router.get('/:communityId/discussions', getCommunityDiscussions);
    router.get('/:communityId/:slug', getDiscussionByCommunityId);
  },
}];
