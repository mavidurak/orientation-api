import { Op } from 'sequelize';
import Joi from '../../joi';

import models from '../../models';
import wanted_contents from '../../models/wanted_contents';
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
const addnewwantedcontent = async (req, res) => {
    const { error } = wantedcontentsSchema.body.validate(req.body);
    if (error) {
        return res.status(400).send({
            errors: error.details,
        });
    }
    const { content_id, status, my_score } = req.body;
    let wanted_contents = await models.wanted_contents.create({
        user_id:req.user.id,
        content_id,
        status,
        my_score,
      });
      return res.send(201,wanted_contents);
};

export default {
    prefix: '/wanted-contents',
    inject: (router) => {
      router.post('', addnewwantedcontent);
    },
  };