import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const users = Sequelize.define('users',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    friends_ids: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: null,
    },
    password_hash: {
      type: DataTypes.STRING,
      allownull: false,
    },
    password_salt: {
      type: DataTypes.STRING,
      allownull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

const initialize = (models) => {

  models.users.prototype.toJSON = function () {
    const values = { ...this.get() };

    delete values.password_salt;
    delete values.password_hash;

    return values;
  };

};

export default {
  model: users,
  initialize,
};
