module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'discussions',
      'community_id',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'communities',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }
    );

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'discussions',
      'community_id',
    );
  }
}