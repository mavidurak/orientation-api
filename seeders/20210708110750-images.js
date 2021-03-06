module.exports = {
  up: async (queryInterface, Sequelize) => {
    const images = [];
    const names = [
      'League of Legends', 'Valorant', 'Counter-Strike: Global Offensive', 'Pianist', 'The Matrix', 'Inception', '11.22.63', 'Friends', 'Dark', '1984', 'A Clockwork Orange', 'The Land of the White Lilies',
      'CSGODose', 'PC Gamer', 'RustyPOt', 'STAR WARS', 'Anime Fan Club', 'Movie Nights', 'Marvel Series', 'Sitcom Valley', 'Series', 'Book Lovers', 'What is the Name of That Book?', 'Poem In Street',
    ];
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
      'https://i.dr.com.tr/cache/500x400-0/originals/0001842239001-1.jpg',
      'https://seeklogo.com/images/C/csgo-logo-CAA0A4D48A-seeklogo.com.png',
      'https://pbs.twimg.com/profile_images/300829764/pc-gamer-avatar.jpg',
      'https://rustypot.com/cfRedTEST.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYxHGp6xY6HMuNBudpY0kcbMZc2LVHJ4cHZA&usqp=CAU',
      'https://uploads.turbologo.com/uploads/design/hq_preview_image/4551835/draw_svg20210723-16163-14u5kc3.svg.png',
      'https://images.all-free-download.com/images/graphicthumb/movie_logo_design_text_reel_filmstrip_icons_decoration_6829232.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWIez0587W6EK7tbrAcSrFZ_scXbvIc4eGLg&usqp=CAU',
      'https://pbs.twimg.com/profile_images/852122370785652738/JxA333Bv_400x400.jpg',
      'https://cdn.mos.cms.futurecdn.net/X8s6YEfHapNfAGsNxjdaN5.jpg',
      'https://i.pinimg.com/originals/dd/64/da/dd64da585bc57cb05e5fd4d8ce873f57.png',
      'https://cdn5.vectorstock.com/i/1000x1000/72/39/logo-character-with-headphones-reading-a-book-vector-4227239.jpg',
      'https://images-platform.99static.com//JYSIbUIVMlm6k85wKxblbowVVB4=/265x256:934x925/fit-in/590x590/99designs-contests-attachments/107/107137/attachment_107137321',
    ];

    for (let index = 1; index < 25; index++) {
      images.push({
        user_id: Math.floor((index + 1) / 2),
        name: `SD/${names[index - 1]}`,
        path: paths[index - 1],
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
