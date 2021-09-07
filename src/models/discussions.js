import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';
import generateSlug from '../utils/generateSlug';

const discussions = Sequelize.define('discussions',
  {
    header: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
      beforeCreate(discussion, options) {
        discussion.slug = generateSlug(discussion.name);
      },
    },
  });

const initialize = (models) => {
  models.discussions.belongsTo(
    models.users, {
      as: 'user',
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
    },
  );
  models.discussions.hasMany(
    models.comments, {
      as: 'comments',
      foreignKey: 'discussion_id',
      sourceKey: 'id',
    },
  );
  models.discussions.belongsTo(models.communities, {
    as: 'communities',
    foreignKey: {
      name: 'community_id',
      allowNull: false,
    },
  });
};

export default {
  model: discussions,
  initialize,
};
