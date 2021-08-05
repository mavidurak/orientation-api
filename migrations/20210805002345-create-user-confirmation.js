module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'is_email_confirmed',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'users',
      'is_email_confirmed',
    );
  },
};
