import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const messages = Sequelize.define('messages',
  {
    from: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

const initialize = (models) => {
  models.messages.belongsTo(
    models.users, {
      as: 'to',
      foreignKey: 'user_id',
    },
  );
  models.messages.belongsTo(
    models.users, {
      as: 'from',
      foreignKey: 'user_id',
    },
  );
};

export default {
  model: messages,
  initialize,
};
