import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';
import { CONTENT_TYPES } from '../constants/content';
import generateSlug from '../utils/generateSlug';

const contents = Sequelize.define('contents',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allownull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rate: {
      type: DataTypes.DECIMAL,
      defaultValue: null,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
      beforeCreate(content, options) {
        content.slug = generateSlug(content.name);
      },
    },
  });

const initialize = (models) => {
  models.contents.belongsTo(models.users, {
    as: 'user',
    foreignKey: {
      name: 'user_id',
      allowNull: false,
    },
  });
  models.contents.belongsTo(models.images, {
    as: 'image',
    foreignKey: {
      name: 'image_id',
      allowNull: false,
    },
  });
  models.contents.hasMany(
    models.wanted_contents, {
      as: 'user_wanted_contents',
      foreignKey: 'content_id',
      sourceKey: 'id',
    },
  );

  models.contents.hasMany(
    models.content_reviews, {
      as: 'content_content_reviews',
      foreignKey: 'content_id',
      sourceKey: 'id',
    },
  );

  models.contents.isSecureContentType = function (type) { // Static method
    const types = Object.entries(CONTENT_TYPES).map((t) => t[1]);
    return types.includes(type);
  };
};

export default {
  model: contents,
  initialize,
};
