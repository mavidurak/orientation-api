import models from '../models';
import HTTPError from '../exceptions/HTTPError';

const createComment = async ({text, content_review_id, discussion_id, parent_comment_id, is_spoiler}, user_id) => {
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

const getCommentById = async (id) => {
  const comment = await models.comments.findOne({
    where: {
      id,
    },
    include: {
      model: models.users,
      as: 'user',
    },
  });
  if (!comment) {
    throw new HTTPError('Comment not found or you don\'t have a permission!', 400);
  }
  return comment;
};

const updateComment = async (id, user_id, text, is_spoiler) => {
  const comment = await getCommentById(id);
  if (!comment) {
    throw new HTTPError('Comment not found or you don\'t have a permission!', 403);
  }
  const update = await models.comments.update({text,is_spoiler},
    {
      where: {
        user_id: user_id,
        id: id,
      }
    });
  if(!update) {
    throw new HTTPError('Some error occurred while updating comment.', 403);
  }
  return update;
};

const deleteComment = async (id, user_id) => {
  const comment = await getCommentById(id);
  if (!comment) {
    throw new HTTPError('Comment not found or you don\'t have a permission!', 403);
  }
  const isDeleted = await models.comments.destroy({
    where: {
      user_id: user_id,
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

const CommentService = {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
  getCommentById,
};

export default CommentService;
