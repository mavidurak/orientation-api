import HTTPError from '../../exceptions/HTTPError';
import Joi from '../../joi';
import models from '../../models';
import ReviewService from '../../services/review';

const createContentReviewsSchema = {
  body: Joi.object({
    content_id: Joi.number()
      .required(),
    text: Joi.string()
      .max(250)
      .required(),
    score: Joi.number()
      .min(0)
      .max(10),
    is_spoiler: Joi.boolean(),
  }),
};
const updateContentReviewsSchema = {
  body: Joi.object({
    text: Joi.string()
      .max(250),
    score: Joi.number()
      .min(0)
      .max(10),
    is_spoiler: Joi.boolean(),
  }),
};

const create = async (req, res, next) => {
  const { error } = createContentReviewsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const {
    content_id, text, score, is_spoiler,
  } = req.body;
  try {
    const contentReview = await ReviewService.createReview({ content_id, text, score, is_spoiler }, req.user.id)

    res.send({
      contentReview,
    });
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contentReview = await ReviewService.getReview(id);
    return res.send(contentReview);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  const { error } = updateContentReviewsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { id } = req.params;
  try {
    const contentReview = await ReviewService.getReview(id);

    const { text, is_spoiler, score } = req.body;
    models.content_reviews.update({ text, is_spoiler, score }, {
      where: {
        id: contentReview.id,
      },
    });
    return res.send({
      message: 'Content review was updated succesfully',
    });
  } catch (err) {
    next(err);
  }
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const contentReview = await ReviewService.getReview(id);
    if (user_id !== contentReview.user_id) {
      throw new HTTPError('you don\'t have permission ', 404);
    }
    await ReviewService.deleteReview(id);
    return res.send({
      message: 'Data set was delected successfully!',
    });
  } catch (err) {
    next(err);
  }
};

const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewService.getUserReviews(req.user.id);
    res.send(200, {
      reviews,
    })
  } catch (err) {
    next(err);
  }
};

const userReviews = async (req, res, next) => {
  const { userId } = req.params;
  const { limit } = req.query;
  try {
    const reviews = await ReviewService.getUserReviews(userId);
    return res.send({ reviews, count: reviews.length });
  } catch (err) {
    next(err);
  }
};

const contentReviews = async (req, res, next) => {
  const { contentId } = req.params;
  const { limit } = req.query;
  try {
    const reviews = await models.content_reviews.findAll({
      where: {
        content_id: contentId,
      },
      limit,
    });
    return res.send({ reviews, count: reviews.length });
  } catch (err) {
    next(err);
  }
};

export default [{
  prefix: '/reviews',
  inject: (router) => {
    router.post('/', create);
    router.get('', getMyReviews);
    router.get('/:id', detail);
    router.put('/:id', update);
    router.delete('/:id', deleteById);
  },
}, {
  prefix: '/users',
  inject: (router) => {
    router.get('/:userId/reviews', userReviews);
  },
}, {
  prefix: '/contents',
  inject: (router) => {
    router.get('/:contentId/reviews', contentReviews);
  },
}];
