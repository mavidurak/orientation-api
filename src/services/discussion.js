import models from '../models';
import HTTPError from '../exceptions/HTTPError';

const createDiscussion = async (
  {
    community_id, header, text, is_private,
  }, user_id,
) => {
  const discussion = await models.discussions.create({
    community_id,
    header,
    text,
    is_private,
    user_id,
  });

  return discussion;
};

const getDiscussion = async (slug) => {
  const discussion = await models.discussions.findOne({
    where: {
      slug,
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
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }
  return discussion;
};

const getDiscussionByUserId = async (slug, user_id) => {
  const discussion = await models.discussions.findOne({
    where: {
      slug,
    },
    include: {
      attributes: { exclude: ['password_hash','password_salt'] },
      model: models.users,
      as: 'user',
      where: {
        id: user_id,
      },
    },
  });
  if (!discussion) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }
  return discussion;
};
const getCommunityDiscussions = async (community_id) => {
  const discussions = await models.discussions.findAll({
    where: {
      community_id,
    },
    include: {
      model: models.communities,
      as: 'communities',
    },
  });
  if (!discussions || discussions.length === 0) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }
  return discussions;
};

const getDiscussionByCommunityId = async (communityId, discussionSlug) => {
  communityId = Number(communityId);
  const discussion = await getDiscussion(discussionSlug);
  if (discussion.community_id !== communityId) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }
  return discussion;
};

const updateDiscussion = async (
  { header, text, is_private }, slug, user_id,
) => {
  const discussion = await getDiscussionByUserId(slug, user_id);

  const update = await discussion.update({
    header, text, is_private,
  }, {

  });

  if (!update) {
    throw new HTTPError('Discussion update failed!', 403);
  }
  return update;
};

const deleteDiscussion = async (slug, user_id) => {
  const discussion = await getDiscussionByUserId(slug, user_id);

  if (!discussion) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }

  const isDeleted = await models.discussions.destroy({
    where: {
      slug,
    },
  });

  if (!isDeleted) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }

  return isDeleted;
};

const DiscussionService = {
  createDiscussion,
  getDiscussion,
  getDiscussionByUserId,
  getDiscussionByCommunityId,
  getCommunityDiscussions,
  updateDiscussion,
  deleteDiscussion,
};

export default DiscussionService;
