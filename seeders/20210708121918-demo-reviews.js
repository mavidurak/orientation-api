module.exports = {
  up: async (queryInterface, Sequelize) => {
    const reviews = [];
    const texts = [
      'rem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. U',
      'nim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ',
      'ex ea commodo consequat. Duis aute',
      'g it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and',
      'rch for lorem ipsum will uncover many web sites still in their infancy.',
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form',
      'If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text.',
      'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.',
      'It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.',
      'The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
      'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
      'Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
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
