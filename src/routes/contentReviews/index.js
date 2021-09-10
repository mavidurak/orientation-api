import Joi from '../../joi';
import models from '../../models';

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

const create = async (req, res) => {
  const { error } = createContentReviewsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const {
    content_id, text, score, is_spoiler,
  } = req.body;
  const contentReview = await models.content_reviews.create({
    user_id: req.user.id,
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
  res.send({
    contentReview,
  });
};

const detail = async (req, res) => {
  const { id } = req.params;
  try {
    const contentReview = await models.content_reviews.findOne({
      where: {
        id,
      },
    });

    if (!contentReview) {
      return res.send({
        errors: [
          {
            message: 'Review not found or you don\'t have a permission!',
          },
        ],
      });
    }

    return res.send(contentReview);
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
  const { error } = updateContentReviewsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { id } = req.params;
  try {
    const contentReview = await models.content_reviews.findOne({
      where: {
        id,
      },
      include: {
        model: models.users,
        as: 'user',
        where: {
          id: req.user.id,
        },
      },
    });
    if (contentReview) {
      const { text, is_spoiler, score } = req.body;
      models.content_reviews.update({ text, is_spoiler, score }, {
        where: {
          id: contentReview.id,
        },
      });
      res.send({
        message: 'Content review was updated succesfully',
      });
    } else {
      res.status(403).send({
        errors: [
          {
            message: 'Review not found or you don\'t have a permission!',
          },
        ],
      });
    }
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

const deleteById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const contentReview = await models.content_reviews.findOne({
    where: {
      id,
    },
  });
  if (contentReview) {
    if (user_id === contentReview.user_id) {
      models.content_reviews.destroy({
        where: {
          id,
        },
      });
      res.send({
        message: 'Data set was delected successfully!',
      });
    }
  } else {
    res.status(401).send({
      errors: [
        {
          message: 'Review not found or you don\'t have a permission!',
        },
      ],
    });
  }
};

const getMyReviews = async (req, res) => {
  const reviews = await models.content_reviews.findAll({
    where: {
      user_id: req.user.id,
    },
    include: {
      model: models.contents,
      as: 'contents',
      include: {
        model: models.images,
        as: 'image',
      },
    },
  });
  return res.send(200, {
    reviews,
  });
};

const userReviews = async (req, res) => {
  const { userId } = req.params;
  const { limit } = req.query;
  try {
    const reviews = await models.content_reviews.findAll({
      where: {
        user_id: userId,
      },
      limit,
    });
    return res.send({ reviews, count: reviews.length });
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

const contentReviews = async (req, res) => {
  const { contentId } = req.params;
  const { limit } = req.query;
  try {
    const reviews = await models.content_reviews.findAll({
      where: {
        content_id: contentId,
      },
      include: {
        model: models.users,
        as: 'user',
      },
      limit,
    });
    return res.send({ reviews, count: reviews.length });
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
