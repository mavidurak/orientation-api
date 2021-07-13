import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const images = Sequelize.define('images',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:true,
    },

    from: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    to: {
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
      foreignKey:'user_id',
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
