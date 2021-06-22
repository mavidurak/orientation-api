import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const content_reviews = Sequelize.define('content_reviews',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: null,
    },
    content_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: null,
    },
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