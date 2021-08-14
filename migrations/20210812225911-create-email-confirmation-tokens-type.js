module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'email_confirmation_tokens',
      'type',
      {
        type: Sequelize.STRING,
      },
    );
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'email_confirmation_tokens',
      'type',
    );
  }
};
