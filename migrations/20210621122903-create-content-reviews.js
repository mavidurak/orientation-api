module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('content_reviews', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      // content_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      // },
      text: {
        type: Sequelize.STRING,
      },
      score: {
        type: Sequelize.INTEGER,
        default: null,
        allowNull: true,
      },
      is_spoiler: {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: true,
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
    return queryInterface.dropTable('content_reviews');
  },
};
