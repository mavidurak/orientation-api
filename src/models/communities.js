import { DataTypes } from 'sequelize';

import Sequelize from '../sequelize';
import generateSlug from '../utils/generateSlug';

const communities = Sequelize.define('communities',
  {
    organizers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    members: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
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
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    website: {
      type: DataTypes.STRING,
    },
    rules: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
      beforeCreate(community, options) {
        community.slug = generateSlug(community.name);
      },
    },
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
  models.communities.belongsToMany(
    models.users, {
      through: 'community_user',
    },
  );
  models.communities.belongsToMany(
    models.users, {
      through: 'user_community',
    },
  );
};
export default {
  model: communities,
  initialize,
};
