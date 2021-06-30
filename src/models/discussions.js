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
      default: 0,
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
};

export default {
  model: discussions,
  initialize,
};
