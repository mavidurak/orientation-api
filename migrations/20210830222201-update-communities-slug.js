module.exports = {
    up(queryInterface, Sequelize) {
      return queryInterface.addColumn(
        'communities',
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
        'communities',
        'slug',
      );
    },
  };
  