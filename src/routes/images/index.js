import Joi from '../../joi';
import ImageService from '../../services/image';
import HTTPError from '../../exceptions/HTTPError';

const create_validation = {
  body: Joi.object({
    name: Joi.string()
      .required(),
    path: Joi.string()
      .required(),
  }),
};

const create = async (req, res) => {
  const { error } = create_validation.body.validate(req.body);

  if (error) {
    return res.send(400,
      {
        errors: error.details,
      });
  }
  const { name, path } = req.body;

  const image = await ImageService.createImage({
    user_id: req.user.id,
    name,
    path,
  });
  return res.status(201).send({
    image,
  });
};

const detail = async (req, res, next) => {
  const { id } = req.params;
  try {
    const image = await ImageService.getImageById(id);

    return res.send(image);
  } catch (err) {
    next(err);
  }
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const image = await ImageService.getImageById(id);

    if (image.user_id !== req.user.id) {
      throw new HTTPError('Image not found or you don\'t have a permission!', 403);
    }
    await ImageService.deleteImage(id, req.user.id);
    res.send({
      message: 'Image was deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export default {
  prefix: '/images',
  inject: (router) => {
    router.post('', create);
    router.get('/:id', detail);
    router.delete('/:id', deleteById);
  },
};
