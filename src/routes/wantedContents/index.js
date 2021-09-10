import Joi from '../../joi';
import models from '../../models';
import WantedContentService from '../../services/wantedcontent';

const wantedContentsSchema = {
  body: Joi.object({
    content_id: Joi.number()
      .required(),
    status: Joi.string()
      .required(),
    my_score: Joi.number()
      .min(0)
      .max(10),
  }),
};
const updateWantedContentsSchema = {
  body: Joi.object({
    content_id: Joi.number(),
    status: Joi.string(),
    my_score: Joi.number()
      .min(0)
      .max(10),
  }),
};

const create = async (req, res, next) => {
  const { error } = wantedContentsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { content_id, status, my_score } = req.body;
  try {
    const wantedList = WantedContentService.create({ content_id, status, my_score }, req.user.id);
    return res.send(201, wantedList);
  } catch (err) {
    next(err);
  }
};

const read = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const wantedList = WantedContentService.read(limit, req.user.id);
    return res.send(201, wantedList);
  } catch (err) {
    next(err);
  }
};

const updatecont = async (req, res, next) => {
  const { error } = updateWantedContentsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  try {
    const { status, my_score } = req.body;
    const wantedList = WantedContentService.updatecont(req.params.contentId, { status, my_score },
      req.user.id);
    return res.send(201, wantedList);
  } catch (err) {
    next(err);
  }
};

const deletecont = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    WantedContentService.deletecont(contentId, req.user.id);
  } catch (err) {
    next(err);
  }
};

const getUserWantedList = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const wantedLists = WantedContentService.getUserWantedList(userId);
    res.send(200, {
      wantedLists,
      count: wantedLists.length,
    });
  } catch (err) {
    next(err);
  }
};

const getContentById = async (req, res,next) => {

  const content_id=req.params.contenId;
  try{
    const wantedContent=WantedContentService.getContentById(req.user.id,content_id);
    return res.send( wantedContent);
  }catch(err){
    next(err);
  }
};

export default [{
  prefix: '/wanted-list',
  inject: (router) => {
    router.get('', read);
    router.post('', create);
    router.get('/:contentId', getContentById);
    router.put('/:contentId', updatecont);
    router.delete('/:contentId', deletecont);
  },
}, {
  prefix: '/users',
  inject: (router) => {
    router.get('/:userId/wanted-list', getUserWantedList);
  },
}];
