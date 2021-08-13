module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((t) => Promise.all([
    queryInterface.changeColumn('content_reviews', 'score', {
      type: Sequelize.DECIMAL,
      default: null,
      allowNull: true,
    }),
    queryInterface.changeColumn('contents', 'rate', {
      type: Sequelize.DECIMAL,
      defaultValue: null,
    }),
  ])),
  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((t) => Promise.all([
    queryInterface.changeColumn('content_reviews', 'score', {
      type: Sequelize.INTEGER,
      default: null,
      allowNull: true,
    }),
    queryInterface.changeColumn('contents', 'rate', {
      type: Sequelize.INTEGER,
      defaultValue: null,
    }),
  ])),
};
