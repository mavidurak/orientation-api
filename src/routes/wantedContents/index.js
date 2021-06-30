import Joi from '../../joi';
import models from '../../models';

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

const create = async (req, res) => {
  const { error } = wantedContentsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const { content_id, status, my_score } = req.body;
  const wanted_contents = await models.wanted_contents.create({
    user_id: req.user.id,
    content_id,
    status,
    my_score,
  });
  return res.send(201, wanted_contents);
};

const read = async (req, res) => {
  const wanted_content = await models.wanted_contents.findAll({
    where: {
      user_id: req.user.id,
    },
  });
  res.send(wanted_content);
  if (!wanted_content) {
    return res.send(400, {
      errors: [
        {
          message: 'Wanted content not found or you don\'t have a permission!',
        },
      ],
    });
  }
};

const updatecont = async (req, res) => {
  const { error } = updateWantedContentsSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const wanted_content = await models.wanted_contents.findOne({
    where: {
      contentId: req.params.contentId,
      user_id: req.user.id,
    },
  });
  const { status, my_score } = req.body;
  if (!wanted_content) {
    return res.send({
      errors: [
        {
          message: 'Content not found or you don\'t have a permission!',
        },
      ],
    });
  }
  models.wanted_contents.update({ status, my_score },
    {
      where: {
        content_id: wanted_content.content_id,
      },
    });
  return res.send(200, 'Content updated succesfully!');
};

const deletecont = async (req, res) => {
  const { contentId } = req.params;
  const { id } = req.user;
  const wantedContent = await models.wanted_contents.findOne({
    where: {
      user_id: id,
      content_id: contentId,
    },
  });
  if (!wantedContent) {
    return res.status(401).send({
      errors: [
        {
          message: 'Content not found or you don\'t have a permission!',
        },
      ],
    });
  }
  await wantedContent.destroy();
  res.send({
    message: 'Content deleted successfully from yours wanted list!',
  });
};

export default {
  prefix: '/wanted-list',
  inject: (router) => {
    router.post('', create);
    router.get('', read);
    router.put('/:contentId', updatecont);
    router.delete('/:contentId', deletecont);
  },
};
