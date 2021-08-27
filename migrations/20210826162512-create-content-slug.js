module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'contents',
      'slug',
      {
        type: Sequelize.STRING,
        primaryKey: true,
      },
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'contents',
      'slug',
    );
  },
};
