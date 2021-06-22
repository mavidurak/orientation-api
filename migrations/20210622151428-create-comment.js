module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content_review_id: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      discussion_id: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      parent_comment_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      text: {
        type: Sequelize.STRING,
        allownull: false
      },
      is_spoiler: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      expired_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comments');
  }
};