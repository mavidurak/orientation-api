import HTTPError from '../exceptions/HTTPError';
import models from '../models';

const getReview = async (id) => {
  const contentReview = await models.content_reviews.findOne({
    where: {
      id,
    },
    include: [{
      model: models.users,
      as: 'user',
    }, {
      model: models.contents,
      as: 'contents',
      include: {
        model: models.images,
        as: 'image',
      },
    }],
  });
  if (!contentReview) {
    throw new HTTPError('Review not found or you don\'t have a permission!', 404);
  }
  return contentReview;
};

const getUserReviews = async (user_id) => {
  const reviews = await models.content_reviews.findAll({
    where: {
      user_id,
    },
    include: [{
      model: models.users,
      as: 'user',
    }, {
      model: models.contents,
      as: 'contents',
      include: {
        model: models.images,
        as: 'image',
      },
    }],
  });
  return reviews;
};

const createReview = async ({ content_id, text, score, is_spoiler }, user_id) => {
  const contentReview = await models.content_reviews.create({
    user_id,
    content_id,
    text,
    score,
    is_spoiler,
  });
  const count = await models.content_reviews.count(
    {
      where: {
        content_id,
      },
    },
  );

  const content = await models.contents.findOne({
    where: {
      id: content_id,
    },
  });
  content.rate = (Number(content.rate) + ((Number(score * 2) - (Number(content.rate))) / count));
  await content.save();
  return contentReview;
};

await ReviewService.updateReview ({ text, is_spoiler, score }, id) => {
  const review = await models.content_reviews.update({ text, is_spoiler, score }, {
    where: {
      id,
    },
  });
  return contentReview;
};

const deleteReview = async (id) => {
  const isDelete = await models.content_reviews.destroy({
    where: {
      id,
    },
  });
  if (!isDelete) {
    throw new HTTPError('review not found', 404);
  }
  return isDelete;
};

const ReviewService = {
  createReview,
  getReview,
  getUserReviews,
  updateReview,
  deleteReview,
};
export default ReviewService;
