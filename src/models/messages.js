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
      as: 'message_to',
      foreignKey: 'to',
    },
  );
  models.messages.belongsTo(
    models.users, {
      as: 'message_from',
      foreignKey: 'from',
    },
  );
};

export default {
  model: messages,
  initialize,
};
