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
  const wanted_content = await models.wanted_contents.findAll({
    where: {
      user_id: req.user_id,
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
  
};

const deletecont = async (req, res) => {
  const { content_id } = req.params;
  const { user_id } = req.user.id;
  const wantedcontent = await models.wanted_contents.findOne({
    where: {
      id: user_id,
      content_id,
    },
  });
  if (wantedcontent) {
    wantedcontent.destroy();
    res.send({
      message: 'Content deleted successfully from yours wanted list!',
    });
    //  alternative way for destroy
    /* 
      models.content_reviews.destroy({
        where: {
      id:user_id,
      content_id:content_id,
        },
      });
      res.send({
        message: ''Content deleted successfully from yours wanted list!',
      });
      */
  } else {
    res.status(401).send({
      errors: [
        {
          message: 'Content not found or you don\'t have a permission!',
        },
      ],
    });
  }
};

export default {
  prefix: '/wanted-list',
  inject: (router) => {
    router.post('', create);
    router.get('', read);
    router.put('/:contentId', deletecont);
  },
};
