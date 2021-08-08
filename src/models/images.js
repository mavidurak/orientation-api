import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const images = Sequelize.define('images',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

const initialize = (models) => {
  models.images.belongsTo(
    models.users, {
      as: 'user',
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
    },
  );
  models.images.hasOne(
    models.contents, {
      as: 'contents_image',
      foreignKey: 'image_id',
      sourceKey: 'id',
    },
  );
  models.images.hasOne(
    models.communities, {
      as: 'communities_image',
      foreignKey: 'image_id',
      sourceKey: 'id',
    },
  );
};

export default {
  model: images,
  initialize,
};
