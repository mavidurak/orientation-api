import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

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
    },
  );
};

export default {
  model: discussions,
  initialize,
};
