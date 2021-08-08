module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('communities', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizers: {
        type: Sequelize.ARRAY({
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
        }),
      },
      members: {
        type: Sequelize.ARRAY({
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
        }),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content_types: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'images',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      website: {
        type: Sequelize.STRING,
      },
      rules: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('communities');
  },
};
