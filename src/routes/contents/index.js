import Joi from '../../joi';
import models from '../../models';

const createContentSchema = {
  body: Joi.object({
    name: Joi.string()
      .max(50)
      .required(),
    type: Joi.string(),
    description: Joi.string()
      .max(250)
      .required(),
    image_path: Joi.string()
      .required(),
  }),
};
const updateContentSchema = {
  body: Joi.object({
    name: Joi.string()
      .max(50),
    type: Joi.string()
      .min(0)
      .max(10),
    description: Joi.string()
      .max(250),
    image_path: Joi.string()
      .max(250)
      .required(),
  }),
};

const create = async (req, res) => {
  const { error } = createContentSchema.body.validate(req.body);
  if (error) {
    return res.status(400).send({
      errors: error.details,
    });
  }
  const {
    name, type, description, image_path,
  } = req.body;
  const image = await models.images.create({
    user_id: req.user.id,
    name: image_path,
    path: image_path,
  });
  const content = await models.contents.create({
    user_id: req.user.id,
    name,
    type,
    description,
    image_id: image.id,
  });
  res.send({
    content,
  });
};

// const detail = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const contentReview = await models.content_reviews.findOne({
//       where: {
//         id,
//       },
//     });

//     if (!contentReview) {
//       return res.send({
//         errors: [
//           {
//             message: 'Review not found or you don\'t have a permission!',
//           },
//         ],
//       });
//     }

//     return res.send(contentReview);
//   } catch (err) {
//     return res.status(500).send({
//       errors: [
//         {
//           message: err.message,
//         },
//       ],
//     });
//   }
// };

// const update = async (req, res) => {
//   const { error } = updateContentReviewsSchema.body.validate(req.body);
//   if (error) {
//     return res.status(400).send({
//       errors: error.details,
//     });
//   }
//   const { id } = req.params;
//   try {
//     const contentReview = await models.content_reviews.findOne({
//       where: {
//         id,
//       },
//       include: {
//         model: models.users,
//         as: 'user',
//         where: {
//           id: req.user.id,
//         },
//       },
//     });
//     if (contentReview) {
//       const { text, is_spoiler, score } = req.body;
//       contentReview.text = text;
//       contentReview.is_spoiler = is_spoiler;
//       contentReview.score = score;

//       models.content_reviews.update({ text, is_spoiler, score }, {
//         where: {
//           id: contentReview.id,
//         },
//       });
//       res.send({
//         message: `Id= ${id} was updated succesfully`,
//       });
//     } else {
//       res.status(403).send({
//         errors: [
//           {
//             message: 'Review not found or you don\'t have a permission!',
//           },
//         ],
//       });
//     }
//   } catch (err) {
//     res.status(500).send({
//       errors: [
//         {
//           message: err.message,
//         },
//       ],
//     });
//   }
// };

// const deleteById = async (req, res) => {
//   const { id } = req.params;
//   const user_id = req.user.id;
//   const contentReview = await models.content_reviews.findOne({
//     where: {
//       id,
//     },
//   });
//   if (contentReview) {
//     if (user_id === contentReview.user_id) {
//       models.content_reviews.destroy({
//         where: {
//           id,
//         },
//       });
//       res.send({
//         message: 'Data set was delected successfully!',
//       });
//     }
//   } else {
//     res.status(401).send({
//       errors: [
//         {
//           message: 'Review not found or you don\'t have a permission!',
//         },
//       ],
//     });
//   }
// };

export default {
  prefix: '/contents',
  inject: (router) => {
    router.post('/', create);
    // router.get('/:id', detail);
    // router.put('/:id', update);
    // router.delete('/:id', deleteById);
  },
};
