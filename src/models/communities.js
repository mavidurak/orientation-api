import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';

const communities = Sequelize.define('communities',
  {
    organizers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    members: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content_types: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    rules: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

const initialize = (models) => {
  models.communities.belongsTo(models.images, {
    as: 'image',
    foreignKey: {
      name: 'image_id',
      allowNull: false,
    },
  });
  models.communities.hasMany(
    models.discussions, {
      as: 'discussions',
      foreignKey: 'community_id',
      sourceKey: 'id',
    },
  );
  models.users.belongsToMany(models.communities, { as: 'userId', through: 'community_user', foreignKey: 'user_id' });
  models.communities.belongsToMany(models.users, { as: 'organizer', through: 'community_user', foreignKey: 'organizers' });

  models.users.belongsToMany(models.communities, { as: 'user', through: 'user_community', foreignKey: 'user_id' });
  models.communities.belongsToMany(models.users, { as: 'member', through: 'user_community', foreignKey: 'members' });
};
export default {
  model: communities,
  initialize,
};
