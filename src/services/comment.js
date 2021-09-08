import models from '../models';
import HTTPError from '../exceptions/HTTPError';

const createComment = async (text, content_review_id, discussion_id, parent_comment_id, is_spoiler, user_id) => {
  if ([content_review_id, discussion_id, parent_comment_id].filter((e) => e).length !== 1) {
    throw new HTTPError('There must be only one id (content_review_id, discussion_id, parent_comment_id)', 400);
  }
  const comment = await models.comments.create({
    user_id,
    text,
    content_review_id,
    discussion_id,
    parent_comment_id,
    is_spoiler,
  });

  return comment;
};

const updateComment = async (id, user_id, text, is_spoiler) => {
  const comment = await models.comments.findOne({
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

  if (!comment) {
    throw new HTTPError('Comment not found or you don\'t have a permission!', 403);
  }
  comment.text = text;
  comment.is_spoiler = is_spoiler;
  await comment.save();

  return comment;
};

const deleteComment = async (id, user_id) => {
  const comment = await models.comments.findOne({
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

  if (!comment) {
    throw new HTTPError('Comment not found or you don\'t have a permission!', 403);
  }

  const isDeleted = await models.comments.destroy({
    where: {
      id,
    },
  });

  if (!isDeleted) {
    throw new HTTPError('Comment not found or you don\'t have a permission!', 403);
  }

  return isDeleted;
};

const getAllComments = async (user_id) => {
  const comments = await models.comments.findAll({
    where: {
      user_id,
    },
  });
  if (!comments) {
    throw new HTTPError('Comment not found or you don\'t have a permission!', 400);
  }
  return comments;
};

const getCommentById = async (user_id, id) => {
  const comment = await models.comments.findOne({
    where: {
      user_id,
      id,
    },
  });
  if (!comment) {
    throw new HTTPError('Comment not found or you don\'t have a permission!', 400);
  }
  return comment;
};

const CommentService = {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
  getCommentById,
};

export default CommentService;
