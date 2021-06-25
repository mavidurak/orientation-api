import { Op } from 'sequelize';
import Joi from '../../joi';

import models from '../../models';
import wanted_contents from '../../models/wanted_contents';
const wantedcontentsSchema = {
    body: Joi.object({
        content_id: Joi.number()
            .required(),
        status: Joi.string(),
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
        user_id: req.user.id,
        content_id,
        status,
        my_score,
    });
    return res.send(201, wanted_contents);
};

const readwwantedcontent = async (req, res) => {
    const { content_id } = req.body;
    const { error } = wantedcontentsSchema.body.validate(req.body);
    if (error) {
        return res.status(400).send({
            errors: error.details,
        });
    }
    if (wanted_content) {
        return res.send(400, {
            errors: [
                {
                    message: "Wanted content not found or you don't have a permission!",
                },
            ],
        });
    }
        let wanted_content = await models.wanted_contents.findOne({
            content_id:content_id
        });
        if(wanted_content.content_id==content_id)
        {
            return res.send(201, wanted_content);
        }
};
export default {
    prefix: '/wanted-contents',
    inject: (router) => {
        router.post('', addnewwantedcontent);
        router.get('', readwwantedcontent);
        router.post('/delete', addnewwantedcontent);
    },
};