import Joi from '../../joi';

import models from '../../models';
import CommentService from '../../services/comment';

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

const createComment = async (req, res, next) => {
  const { error } = createCommentSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  try {
    const {
      text, content_review_id, discussion_id, parent_comment_id, is_spoiler,
    } = req.body; 
    const comment = await CommentService.createComment({text, content_review_id, discussion_id, parent_comment_id, is_spoiler}, req.user.id);

    res.send({
      comment,
    });
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, is_spoiler } = req.body;
    const comment = await CommentService.updateComment(id, req.user.id, text, is_spoiler);
    res.send({
      message: 'Comment updated successfully!',
    });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CommentService.deleteComment(id, req.user.id);
    return res.send(200, {
      message: 'Comment deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const comments = await CommentService.getAllComments(userId);
    res.send({
      comments,
      count: comments.length,
    });
  } catch (err) {
    next(err);
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const { userId, id } = req.params;
    if(req.user.id !== userId){
      throw new HTTPError('Comment not found or you don\'t have a permission!', 400);
    }
    const comment = await CommentService.getCommentById(id);
    res.send({ comment });
  } catch (err) {
    next(err);
  }
};

export default [{
  prefix: '/comments',
  inject: (router) => {
    router.post('', createComment);
    router.put('/:id', updateComment);
    router.delete('/:id', deleteComment);
  },
}, {
  prefix: '/users',
  inject: (router) => {
    router.get('/:userId/comments', getAllComments);
    router.get('/:userId/comments/:id', getCommentById);
  },
}];
