import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const content_reviews = Sequelize.define('content_reviews',
  {
    text: {
      type: DataTypes.STRING,
    },
    score: {
      type: DataTypes.NUMBER,
    },
    is_spoiler: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    timestamps: true,
  });

  const initialize = (models) => {
  };


export default {
  model: content_reviews,
  initialize,
};