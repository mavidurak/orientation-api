import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const discussions = Sequelize.define('discussions',
  {
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
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
      foreignKey: 'discussions_id',
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
