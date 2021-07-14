module.exports = {
  up: async (queryInterface, Sequelize) => {
    const images = [];
    const names = ['League of Legends', 'Valorant', 'Counter-Strike: Global Offensive', 'Pianist', 'The Matrix', 'Inception', '11.22.63', 'Friends', 'Dark', '1984', 'A Clockwork Orange', 'The Land of the White Lilies'];
    const paths = [
      'https://m.media-amazon.com/images/M/MV5BYjM2NmU3YmEtZDI1OC00NTQ5LWJmOGMtYmZmNGUyMWRlODBmXkEyXkFqcGdeQXVyNjU1OTg4OTM@._V1_.jpg',
      'https://cdnb.artstation.com/p/assets/images/images/027/875/935/large/pham-linh-artboard-1.jpg?1592832337',
      'https://cdn.shopify.com/s/files/1/0747/3829/products/mL3927_1024x1024.jpg?v=1574110221',
      'https://i.pinimg.com/originals/36/f3/f2/36f3f227e37e81c57d1df99f9e4c3a5b.jpg',
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
      'https://i.pinimg.com/originals/1e/5b/e3/1e5be3033b78c4928dce71947ddb09a2.jpg',
      'https://cdn.europosters.eu/image/1300/posters/friends-tv-series-i104626.jpg',
      'https://i.pinimg.com/originals/67/5e/bc/675ebc2fd210a8bd5362928a51514960.jpg',
      'https://anylang.net/sites/default/files/covers/1984.jpg',
      'https://www.penguinsciencefiction.org/images/3219_ANTHONY_BURGESS_A_Clockwork_Orange_1972.jpg',
      'https://i.dr.com.tr/cache/500x400-0/originals/0001842239001-1.jpg'
    ];

    for (let index = 0; index < 12; index++) {
      images.push({
        user_id: index + 1,
        name: `SD/${names[index]}`,
        path: paths[index],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('images', images);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('images', {
      name: {
        [Sequelize.Op.startsWith]: 'SD/',
      },
    });
  },
};
