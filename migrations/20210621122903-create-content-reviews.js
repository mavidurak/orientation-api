module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('content_reviews', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: null,
      },
      content_id: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: null,
      },
      text: {
        type: Sequelize.STRING,
      },
      score: {
        type: Sequelize.INTEGER,
      },
      is_spoiler: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
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