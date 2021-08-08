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

  models.email_confirmation_tokens.prototype.confirmEmail = async function () {
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
    return true;
  };
};

export default {
  model: email_confirmation_tokens,
  initialize,
};
