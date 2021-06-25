import models from '../../models';
import Joi from '../../joi';

const create_validation = {
  body: Joi.object({
    name: Joi.string()
    .required(),
    path: Joi.string()
    .required(),
  }),
};

const add = async (req, res) => {
  const { error } = create_validation.body.validate(req.body);

  if (error) {
    return res.send(400,
                    { 
      errors: error.details
    }
                   );
  }
  const { name, path } = req.body;
  
  if (!req.user) {
    return res.status(403).send({
    errors: [
      {
        message: 'Image not found or you don\'t have a permission!',
      },
    ],
  });
  }
  const image = await models.images.create({
      user_id: user.id,
      name,
      path,
    });
    return res.status(201).send({
      image,
    });
  }
};

const detail = async (req, res) => {
  const { id }=req.params;
  try {
    const image = await models.images.findOne({
      where:{
        id,
      },
    });

    if(!image){
      return res.send({
      errors: [
        {
          message: 'Image not found or you don\'t have a permission!',
        },
      ],
    });
    }
    return res.send(image);

  } catch (err) {
    return res.status(500).send({
      errors: [
        {
          message: err.message ,
        },
      ],
    });
  }
};

const deleteById = async (req, res) => {
  const { id }= req.params;
  try {
    const image = await models.images.findOne({
      where:{
        id,
        user_id:req.user.id,
      },
    });

    if(!image){
      return res.send({
      errors: [
        {
          message: 'Image not found or you don\'t have a permission!',
        },
      ],
    });
    }
    const deleteimage = await models.images.destroy({
        where:{
          id,
        },
      });

      if(!deleteimage){
         res.send({
          message: 'Image not found or you don\'t have a permission!',
        });
    
      }
      res.send({
          message: 'Image was deleted successfully!',
        });
       
  } catch (err) {
    return res.status(500).send({
      errors: [
        {
          message: err.message ,
        },
      ],
    });
  }
};

export default {
  prefix: '/images',
  inject: (router) => {
    router.post('/add', add);
    router.get('/:id', detail);
    router.delete('/:id', deleteById);
  },
};
