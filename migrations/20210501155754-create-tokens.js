module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'tokens',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
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
        value: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        ip_address: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        expired_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
    );
  },
  down(queryInterface) {
    return queryInterface.dropTable('tokens');
  },
};
