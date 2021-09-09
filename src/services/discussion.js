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

const getDiscussion = async (id) => {
  const discussion = await models.discussions.findOne({
    where: {
      id,
    },
  });
  if (!discussion) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }
  return discussion;
};

const getDiscussionByUserId = async (id, user_id) => {
  const discussion = await models.discussions.findOne({
    where: {
      id,
    },
    include: {
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

const getDiscussionByCommunityId = async (communityId, discussionId) => {
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
      model: models.users,
      as: 'user',
    }],
  });
  if (!discussion) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }
  return discussion;
};

const getCommunityDiscussions = async (communityId) => {
  const discussions = await models.discussions.findAll({
    where: {
      community_id: communityId,
    },
  });
  if (!discussions || discussions.length === 0) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }
  return discussions;
};

const updateDiscussion = async (
  { header, text, is_private }, id, user_id,
) => {
  const discussion = await getDiscussionByUserId(id, user_id);

  if (!discussion) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }

  discussion.header = header;
  discussion.text = text;
  discussion.is_private = is_private;
  await discussion.save();

  return discussion;
};

const deleteDiscussion = async (id, user_id) => {
  const discussion = await getDiscussionByUserId(id, user_id);

  if (!discussion) {
    throw new HTTPError('Discussion not found or you don\'t have a permission!', 403);
  }

  const isDeleted = await models.discussions.destroy({
    where: {
      id,
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
