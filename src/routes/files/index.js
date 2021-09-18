import generateSlug from '../../utils/generateSlug';
import models from '../../models';
import HTTPError from '../../exceptions/HTTPError';
import ImageService from '../../services/image';

const upload = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new HTTPError('No files were uploaded.', 400);
    }
    const { file } = req.files;
    const path = await ImageService.uploadFile(file);
    const image = await ImageService.createImage({
      user_id: req.user.id,
      name: file.name,
      path,
    });
    return res.status(201).send({
      image,
    });
  } catch (error) {
    next(error);
  }
};
const getFile = async (req, res, next) => {
  const { path } = req.params;

  try {
    const files = await ImageService.getImageByPath(path);
    return res.sendFile(__dirname.replace('src/routes/files', 'uploads/') + path);
  } catch (err) {
    next(err);
  }
};

export default {
  prefix: '/files',
  inject: (router) => {
    router.post('/upload', upload);
    router.get('/:path', getFile);
  },
};
