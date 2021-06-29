module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('comments', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    content_review_id: {
      type: Sequelize.INTEGER,
      defaultValue: null,
    },
    discussion_id: {
      type: Sequelize.INTEGER,
      defaultValue: null,
    },
    parent_comment_id: {
      type: Sequelize.INTEGER,
      defaultValue: null,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_spoiler: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('comments'),
};
