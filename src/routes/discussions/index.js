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

    res.status(201).send({
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
  try {
    const { discussionSlug } = req.params;
    const discussion = await DiscussionService.getDiscussion(discussionSlug);

    const parents = await models.comments.findAll({
      where: {
        discussion_id: discussion.id,
      },
      include: {
        attributes: { exclude: ['password_hash','password_salt'] },
        model: models.users,
        as: 'user',
      },
    });

    if (parents.length === 0) {
      return res.send({ comments: [] });
    }

    let isLastStep = false;
    let childs = await models.comments.findAll({
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


const getCommunityDiscussions = async (req, res, next) => {
  try {
    const { communitySlug } = req.params;
    const community = await models.communities.findOne({
      where: {
        slug: communitySlug,
      },
    });
    const discussions = await DiscussionService.getCommunityDiscussions(community.id);
    res.send({ discussions });
  } catch (err) {
    next(err);
  }
};

const getDiscussionByCommunityId = async (req, res, next) => {
  try {
    const { communitySlug, discussionSlug } = req.params;
    const community = await models.communities.findOne({
      where: {
        slug: communitySlug,
      },
    });

    // eslint-disable-next-line max-len
    const discussion = await DiscussionService.getDiscussionByCommunityId(community.id, discussionSlug);
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
    router.get('/:discussionSlug/comments', getCommentsById);
  },
},
{
  prefix: '/communities',
  inject: (router) => {
    router.get('/:communitySlug/discussions', getCommunityDiscussions);
    router.get('/:communitySlug/:discussionSlug', getDiscussionByCommunityId);
  },
}];
