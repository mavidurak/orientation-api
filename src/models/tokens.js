import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const tokens = Sequelize.define('tokens',
  {
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    underscored: true,
  });

const initialize = (models) => {
  models.tokens.belongsTo(models.users, {
    as: 'user',
    foreignKey: {
      name: 'user_id',
      allowNull: false,
    },
  });

  models.tokens.prototype.isExpired = function () {
    return this.expired_at < Date.now();
  };
};

export default {
  model: tokens,
  initialize,
};
