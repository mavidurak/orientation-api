module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'discussions',
      'slug',
      {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
      },
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'discussions',
      'slug',
    );
  },
};
