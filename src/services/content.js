import models from '../models';
import HTTPError from '../exceptions/HTTPError';

const createContent = async ({
  name, type, description, image_path,
}, user_id) => {
  const image = await models.images.create({
    user_id,
    name: image_path,
    path: image_path,
  });
  const content = await models.contents.create({
    name,
    type,
    description,
    image_id: image.id,
    user_id,
  });

  return content;
};

const getContent = async (slug) => {
  const content = await models.contents.findOne({
    where: {
      slug,
    },
    include: [
      {
        model: models.images,
        as: 'image',
      },
      {
        model: models.users,
        as: 'user',
      },
    ],
  });

  if (!content) {
    throw new HTTPError('Content not found or you don\'t have a permission!', 403);
  }

  return content;
};

const getContents = async (limit) => {
  const contents = await models.contents.findAll({
    limit,
    include: {
      model: models.images,
      as: 'image',
    },
  });
  return contents;
};

const getContentByUserId = async (slug, user_id) => {
  const content = await models.contents.findOne({
    where: {
      slug,
    },
    include: {
      model: models.users,
      as: 'user',
      where: {
        id: user_id,
      },
    },
  });

  if (!content) {
    throw new HTTPError('Content not found or you don\'t have a permission!');
  }

  return content;
};

const updateContent = async (
  {
    name, type, description, image_path,
  }, slug, user_id,
) => {
  await getContentByUserId(slug, user_id);
  const image = await models.images.create({
    user_id,
    name: image_path,
    path: image_path,
  });
  await models.contents.update({
    name, type, description, image_id: image.id,
  }, {
    where: {
      slug,
    },
  });
  const content = await getContent(slug);

  return content;
};

const deleteContent = async (id) => {
  const isDeleted = await models.contents.destroy({
    where: {
      id,
    },
  });

  if (!isDeleted) {
    throw new HTTPError('Content not found or you don\'t have a permission!', 403);
  }

  return isDeleted;
};

const ContentService = {
  createContent,
  getContent,
  getContents,
  updateContent,
  deleteContent,
  getContentByUserId,
};

export default ContentService;
