module.exports = {
  up: async (queryInterface, Sequelize) => {
    const reviews = [];
    const texts = [
      'rem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. U',
      'nim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ',
      'ex ea commodo consequat. Duis aute',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ];

    for (let text, index = 0; index < 12; index++) {
      text = texts[index];

      reviews.push({
        user_id: index + 1,
        content_id: index + 1,
        text,
        score: Math.floor(Math.random() + 6),
        is_spoiler: Math.random() < 0.3,
        created_at: new Date('2012-12-21'),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('content_reviews', reviews);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('content_reviews', {
      created_at: new Date('2012-12-21')
    });
  },
};
