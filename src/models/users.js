import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';
import { encrypt } from '../utils/encription';

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
  models.users.hasMany(
    models.tokens, {
      as: 'user_tokens',
      foreignKey: 'user_id',
      sourceKey: 'id',
    },
  );
  models.users.hasMany(
    models.content_reviews, {
      as: 'user_content_reviews',
      foreignKey: 'user_id',
      sourceKey: 'id',
    },
  );

  models.users.prototype.toJSON = function () {
    const values = { ...this.get() };

    delete values.password_salt;
    delete values.password_hash;

    return values;
  };

  models.users.prototype.createToken = async function (ip_address) {
    const expired_at = new Date();
    expired_at.setDate(new Date().getDate() + 30);
    const timestamp = Math.round(new Date().getTime() / 1000);
    const key = `${this.id}_${this.password_hash}_${timestamp}`;

    const token = await models.tokens.create({
      user_id: this.id,
      value: encrypt(key),
      ip_address,
      expired_at,
    });

    return token;
  };
};

export default {
  model: users,
  initialize,
};
