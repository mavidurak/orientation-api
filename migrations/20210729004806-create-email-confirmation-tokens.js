module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.createTable('email_confirmation_tokens', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'PENDING',
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    }),
    queryInterface.addColumn(
      'users',
      'is_email_confirmed',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    )]);
  },
  down(queryInterface) {
    return Promise.all([
      queryInterface.dropTable('email_confirmation_tokens'),
      queryInterface.removeColumn(
        'users',
        'is_email_confirmed',
      ),
    ]);
  },
};
