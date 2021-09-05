import { DataTypes } from 'sequelize';
import { EMAIL_TOKEN_STATUS } from '../constants/email';

import Sequelize from '../sequelize';

const email_confirmation_tokens = Sequelize.define('email_confirmation_tokens',
  {
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: EMAIL_TOKEN_STATUS.PENDING,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

const initialize = (models) => {
  models.email_confirmation_tokens.belongsTo(
    models.users, {
      as: 'user',
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
    },
  );

  models.email_confirmation_tokens.prototype.cancelOtherTokens = async function () {
    const token = await models.email_confirmation_tokens.findAll({
      where: {
        type: this.type,
        status: EMAIL_TOKEN_STATUS.PENDING,
      },
    });
    if (!token) {
      return false;
    }
    for (let i = 0; i < token.length; i++) {
      token[i].status = EMAIL_TOKEN_STATUS.CANCELLED;
      await token[i].save();
    }
    return true;
  };

  models.email_confirmation_tokens.prototype.confirmToken = async function () {
    const user = await models.users.findOne({
      where: {
        id: this.user_id,
      },
    });
    if (!user) {
      return false;
    }
    user.is_email_confirmed = true;
    await user.save();
    this.status = EMAIL_TOKEN_STATUS.CONFIRMED;
    await this.save();
    this.cancelOtherTokens();
    return true;
  };
};

export default {
  model: email_confirmation_tokens,
  initialize,
};
