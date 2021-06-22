import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';


const comments = Sequelize.define('comments',
  {

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content_review_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    discussion_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    parent_comment_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    text: {
      type: DataTypes.STRING,
      allownull: false,
    },
    is_spoiler: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  export default {
    model: comments,
    initialize,
  };



