module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('wanted_contents', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'contents',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      my_score: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('wanted_contents');
  },
};
