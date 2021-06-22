module.exports = {
    up(queryInterface, Sequelize) {
      return queryInterface.createTable('wanted_contents', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          unique:true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          unique: true,
          allowNull: false,
        },
        content_id: {
           type: Sequelize.INTEGER,
           allowNull:false,
        },
        status: {
          type: Sequelize.STRING(200),
          allowNull:false,
        },
        my_score: {
          type: Sequelize.INTEGER,
          maxvalue:5,
          minvalue:1,
          allowNull: true,
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
      });
    },
    down(queryInterface) {
      return queryInterface.dropTable('users');
    },
  };
  