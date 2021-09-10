import Joi from '../../joi';
import ContentService from '../../services/content';

const createContentSchema = {
  body: Joi.object({
    name: Joi.string()
      .max(50)
      .required(),
    type: Joi.string()
      .required(),
    description: Joi.string()
      .max(250)
      .required(),
    image_path: Joi.string()
      .required(),
  }),
};
const updateContentSchema = {
  body: Joi.object({
    name: Joi.string()
      .max(50),
    type: Joi.string()
      .min(0)
      .max(10),
    description: Joi.string()
      .max(250),
    image_path: Joi.string()
      .max(250),
  }),
};

const create = async (req, res, next) => {
  const { error } = createContentSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  try {
    const content = await ContentService.createContent({ ...req.body }, req.user.id);
    res.status(200).send({
      content,
    });
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const content = await ContentService.getContent(slug);
    content.views += 1;
    await content.save();
    res.send({ content });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  const { error } = updateContentSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { slug } = req.params;
  try {
    const content = await ContentService.updateContent({ ...req.body }, slug, req.user.id);
    res.status(200).send({ content });
  } catch (err) {
    next(err);
  }
};

const deleteContent = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const content = await ContentService.getContentByUserId(slug, req.user.id);
    await ContentService.deleteContent(content.id);
    return res.send(200, {
      message: 'Content deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

const getContents = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const contents = await ContentService.getContents(limit);
    res.send({ contents });
  } catch (err) {
    next(err);
  }
};

export default {
  prefix: '/contents',
  inject: (router) => {
    router.get('', getContents);
    router.post('/', create);
    router.get('/:slug', detail);
    router.put('/:slug', update);
    router.delete('/:slug', deleteContent);
  },
};
