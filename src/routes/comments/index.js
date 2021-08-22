import Joi from '../../joi';

import models from '../../models';

const createCommentSchema = {
  body: Joi.object({
    content_review_id: Joi.number(),
    discussion_id: Joi.number(),
    parent_comment_id: Joi.number(),
    text: Joi.string()
      .max(250)
      .required(),
    is_spoiler: Joi.boolean(),
  }),
};

const createComment = async (req, res) => {
  const { error } = createCommentSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const {
    text, content_review_id, discussion_id, parent_comment_id, is_spoiler,
  } = req.body;

  if ([content_review_id, discussion_id, parent_comment_id].filter((e) => e).length !== 1) {
    return res.send(400, {
      errors: [
        {
          message: 'There must be only one id (content_review_id, discussion_id, parent_comment_id)',
        },
      ],
    });
  }

  const comment = await models.comments.create({
    user_id: req.user.id,
    text,
    content_review_id,
    discussion_id,
    parent_comment_id,
    is_spoiler,
  });
  res.send({
    comment,
  });
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const comment = await models.comments.findOne({
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

  if (!comment) {
    return res.send(403, {
      errors: [
        {
          message: 'Comment not found or you don\'t have a permission!',
        },
      ],
    });
  }

  const { text, is_spoiler } = req.body;
  comment.text = text;
  comment.is_spoiler = is_spoiler;
  await comment.save();

  res.send({ comment });
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const comment = await models.comments.findOne({
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

  if (!comment) {
    return res.send(403, {
      errors: [
        {
          message: 'Comment not found or you don\'t have a permission!',
        },
      ],
    });
  }

  const isDeleted = await models.comments.destroy({
    where: {
      id,
    },
  });

  if (!isDeleted) {
    res.send(403, {
      errors: [
        {
          message: 'Comment not found or you don\'t have a permission!',
        },
      ],
    });
  }

  return res.send(200, {
    message: 'Comment deleted successfully!',
  });
};

const getAllComments = async (req, res) => {
  const { userId } = req.params;
  const comments = await models.comments.findAll({
    where: {
      user_id: userId,
    },
  });
  if (!comments) {
    return res.send(400, {
      errors: [
        {
          message: 'Comment not found or you don\'t have a permission!',
        },
      ],
    });
  }
  res.send({
    comments,
    count: comments.length,
  });
};

const getCommentById = async (req, res) => {
  const { userId, id } = req.params;
  const comment = await models.comments.findOne({
    where: {
      user_id: userId,
      id,
    },
  });
  if (!comment) {
    return res.send(400, {
      errors: [
        {
          message: 'Comment not found or you don\'t have a permission!',
        },
      ],
    });
  }
  res.send({ comment });
};

const parentComment = async (req, res) => {
  const { id } = req.params;
  const comments = await models.comments.findAll({
    where: {
      parent_comment_id: id,
    },
  });
};

export default [{
  prefix: '/comments',
  inject: (router) => {
    router.post('', createComment);
    router.put('/:id', updateComment);
    router.delete('/:id', deleteComment);
    router.get('/:id/parent_comment', parentComment);
  },
}, {
  prefix: '/users',
  inject: (router) => {
    router.get('/:userId/comments', getAllComments);
    router.get('/:userId/comments/:id', getCommentById);
  },
}];
