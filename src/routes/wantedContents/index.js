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

const createWantedContent = async (req, res, next) => {
  const { error } = wantedContentsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { content_id, status, my_score } = req.body;
  try {
    const wantedList = WantedContentService.createWantedContent({ content_id, status, my_score }, req.user.id);
    return res.send(201, wantedList);
  } catch (err) {
    next(err);
  }
};


const updateWantedContent = async (req, res, next) => {
  const { error } = updateWantedContentsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  try {
    const { status, my_score } = req.body;
    const wantedList = await WantedContentService.updateWantedContent( { status, my_score },req.params.contentId,
      req.user.id);
    return res.send(201, wantedList);
  } catch (err) {
    next(err);
  }
};

const deleteWantedContent = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    await WantedContentService.deleteWantedContent(contentId, req.user.id);
  } catch (err) {
    next(err);
  }
};

const getWantedList = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const wantedLists = await WantedContentService.getWantedList(userId);
    res.send(200, {
      wantedLists,
      count: wantedLists.length,
    });
  } catch (err) {
    next(err);
  }
};

const getWantedContentByContentId = async (req, res,next) => {

  const content_id=req.params.contenId;
  try{
    const wantedContent=await WantedContentService.getWantedContentByContentId(req.user.id,content_id);
    return res.send( wantedContent);
  }catch(err){
    next(err);
  }
};

export default [{
  prefix: '/wanted-list',
  inject: (router) => {
    router.post('', createWantedContent);
    router.get('/:contentId', getWantedContentByContentId);
    router.put('/:contentId', updateWantedContent);
    router.delete('/:contentId', deleteWantedContent);
  },
}, {
  prefix: '/users',
  inject: (router) => {
    router.get('/:userId/wanted-list', getWantedList);
  },
}];
