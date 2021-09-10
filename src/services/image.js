import models from '../models';
import HTTPError from '../exceptions/HTTPError';
import generateSlug from '../utils/generateSlug'

const uploadFile = async (file) => {
  let uploadPath;
  let path = generateSlug(file.name) + file.name;
  uploadPath = __dirname.replace('src/services', 'uploads/') + path;
  await file.mv(uploadPath, function (err) {
    if (err) {
      throw new HTTPError(err.message, 500);
    }
  });
  return path;
};

const getImageByPath = async (path) => {
  const file = await models.images.findOne({
    where: {
      path,
    },
  });

  if (!file) {
    throw new HTTPError('Image not found or you don\'t have a permission!', 404);
  }
  return file;
};

const getImageById = async (id) => {
  const file = await models.images.findOne({
    where: {
      id,
    },
  });

  if (!file) {
    throw new HTTPError('Image not found or you don\'t have a permission!', 404);
  }
  return file;
};

const createImage = async ({ user_id, name, path }) => {

  const image = await models.images.create({
    user_id,
    name,
    path,
  });
  return image;
};

const updateImage = async ({ name }, user_id) => {
  const image = await getImageByPath(path);
  const updatedImage = await image.update({ name });
  return updatedImage;
};

const deleteImage = async (id, user_id) => {
  const isdeleted = await models.images.destroy({
    where: {
      id,
      user_id,
    },
  });
  return isdeleted;
};

const ImageService = {
  uploadFile,
  createImage,
  getImageByPath,
  getImageById,
  deleteImage,
  updateImage,
};

export default ImageService;
