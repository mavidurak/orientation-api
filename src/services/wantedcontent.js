import models from '../models';
import HTTPError from '../exceptions/HTTPError';

const createWantedContent = async ({ content_id, status, my_score }, user_id) => {
  const wantedList = await models.wanted_contents.create({
    user_id,
    content_id,
    status,
    my_score,
  });
  return wantedList;
};

const updateWantedContent = async ({ status, my_score },content_id, user_id) => {
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
};

const deleteWantedContent = async (contentId, user_id) => {
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
};

const getWantedList = async (user_id) => {
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

const getWantedContentByContentId = async (user_id,content_id) => {
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
  createWantedContent,
  updateWantedContent,
  deleteWantedContent,
  getWantedList,
  getWantedContentByContentId,
};

export default WantedContentService;
