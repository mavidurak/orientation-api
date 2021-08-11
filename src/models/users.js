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
    is_email_confirmed: {
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
  models.users.hasMany(
    models.images, {
      as: 'user_images',
      foreignKey: 'user_id',
      sourceKey: 'id',
    },
  );
  models.users.hasMany(
    models.contents, {
      as: 'user_contents',
      foreignKey: 'user_id',
      sourceKey: 'id',
    },
  );
  models.users.hasMany(
    models.wanted_contents, {
      as: 'user_wanted_contents',
      foreignKey: 'user_id',
      sourceKey: 'id',
    },
  );

  models.users.hasMany(
    models.messages, {
      as: 'user_message_to',
      foreignKey: 'to',
      sourceKy: 'id',
    },
  );
  models.users.hasMany(
    models.messages, {
      as: 'user_message_from',
      foreignKey: 'from',
      sourceKy: 'id',
    }
  );

  models.users.hasMany(
    models.comments, {
      as: 'comments',
      foreignKey: 'user_id',
      sourceKey: 'id',
    },
  );
  models.users.hasMany(
    models.email_confirmation_tokens, {
      as: 'user_email_confirmation_tokens',
      foreignKey: 'user_id',
      sourceKey: 'id',
    },
  );
  models.users.belongsToMany(
    models.communities, { 
      through: 'community_user' 
  });
  models.users.belongsToMany(
    models.communities, { 
      through: 'user_community' 
  });
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

  models.users.prototype.createEmailConfirmationToken = async function () {
    const key = this.username + this.email + Math.floor(Math.random() * 9999);
    let key2 = '';

    for (let i = 0; i < key.length; i++) {
      key2 += key[i] + Math.floor(Math.random() * 9);
    }

    const value = encrypt(key2);

    const emailConfirmationToken = await models.email_confirmation_tokens.create({
      value,
      user_id: this.id,
    });

    return emailConfirmationToken.value;
  };
};

export default {
  model: users,
  initialize,
};
