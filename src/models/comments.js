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
      allowNull: false,
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
      foreignKey: 'user_id',
      sourceKey: 'id',
    },
  );
  models.comments.belongsTo(
    models.content_reviews, {
      as: 'content_review',
      foreignKey: 'content_reviews_id',
      sourceKey: 'id',
    },
  );
  models.comments.belongsTo(
    models.discussions, {
      as: 'discussion',
      foreignKey: 'discussions_id',
      sourceKey: 'id',
    },
  );
  models.comments.belongsTo(
    models.comments, {
      as: 'parent',
      foreignKey: 'parent_comment_id',
      sourceKey: 'id',
    },
  );
  models.comments.hasMany(
    models.comments, {
      as: 'children',
      foreignKey: 'parent_comment_id',
      sourceKey: 'id',
    },
  );
};

export default {
  model: comments,
  initialize,
};
