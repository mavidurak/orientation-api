import models from '../models';
import HTTPError from '../exceptions/HTTPError';

const create = async ({ content_id, status, my_score }, user_id) => {
  const wantedList = await models.wanted_contents.create({
    user_id,
    content_id,
    status,
    my_score,
  });
  return wantedList;
};
const read = async (limit, user_id) => {
  const wantedList = await models.wanted_contents.findAll({
    where: {
      user_id,
    },
    limit,
  });
  if (!wantedList) {
    throw new HTTPError('Wanted content not found or you don\'t have a permission', 404);
  }
  return { wantedList };
};

const updatecont = async (content_id, { status, my_score }, user_id) => {
  const wantedList = await models.wanted_contents.findOne({
    where: {
      content_id,
      user_id,
    },
  });
  if (!wantedList) {
    throw new HTTPError('Content not found or you don\'t have a permission', 400);
  }
  await models.wanted_contents.update({ status, my_score },
    {
      where: {
        content_id,
        user_id,
      },
    });
  throw new HTTPError('Content updated succesfully', 200);
};

const deletecont = async (contentId, user_id) => {
  const wantedContent = await models.wanted_contents.findOne({
    where: {
      user_id,
      contentId,
    },
  });
  if (!wantedContent) {
    throw new HTTPError('Content not found or you don\'t have a permission!', 401);
  }
  await wantedContent.destroy();
  throw new HTTPError('Content deleted successfully from yours wanted list!', 200);
};

const getUserWantedList = async (user_id) => {
  const wantedLists = await models.wanted_contents.findAll({
    where: {
      user_id,
    },
  });
  if (!wantedLists) {
    throw new HTTPError('Content not found or you don\'t have a permission!', 400);
  }
  return wantedLists;
};

const getContentById = async (user_id,content_id) => {
  const wantedContent = await models.wanted_contents.findOne({
    where: {
      user_id,
      content_id,
    },
  });
  if (!wantedContent) {
    throw new HTTPError('Content not found or you don\'t have a permission!', 400);
  }
  return wantedContent;
};

const WantedContentService = {
  create,
  read,
  updatecont,
  deletecont,
  getUserWantedList,
  getContentById,
};

export default WantedContentService;
