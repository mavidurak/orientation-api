import Joi from '../../joi';
import models from '../../models';

const wantedcontentsSchema = {
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

const create = async (req, res) => {
  const { error } = wantedcontentsSchema.body.validate(req.body);
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
  const wantedContents = await models.wanted_contents.findAll({
    where: {
      user_id: req.user_id,
    },
  });
  res.send(wantedContents);
  if (!wantedContents) {
    return res.send(400, {
      errors: [
        {
          message: 'Wanted content not found or you don\'t have a permission!',
        },
      ],
    });
  }
};
export default {
  prefix: '/wanted-contents',
  inject: (router) => {
    router.post('', create);
    router.get('', read);
  },
};
