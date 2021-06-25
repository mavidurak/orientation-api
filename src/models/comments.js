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

const initialize = (models) => {
  models.comments.belongsTo(
    models.users, {
    as: 'user',
    foreignKey: 'user_id'
  },
    models.content_reviews, {
    as: 'content_review',
    foreignKey: 'content_reviews_id'
  },
    models.discussions, {
    as: 'discussion',
    foreignKey:'discussions_id' 
  },
  models.comments, {
    as: 'parent',
    foreignKey: 'parent_comment_id'
  },
  );
  model.comments.hasMany(
    models.comments, {
      as: 'children',
      foreignKey: 'parent_comment_id'
    }
  );
};

export default {
  model: comments,
  initialize,
};
