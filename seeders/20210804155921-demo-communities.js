module.exports = {
  up: async (queryInterface, Sequelize) => {
    const communities = [];
    const names = ['CSGODose', 'PC Gamer', 'RustyPot', 'STAR WARS', 'Anime Fan Club', 'Movie Nights', 'Marvel Series', 'Sitcom Valley', 'Series', 'Book Lovers', 'What is the Name of That Book?', 'Poem In Street'];
    const descriptions = [
      'We are waiting for all cs go players',
      'If you want to discuss pc games and play games together, you are in the right place.',
      'All rust players are here. Come on join',
      'This is the star wars community',
      'anime <3',
      'Every night we watch and discuss a selected movie',
      'A community where marvel series are discussed and shared',
      'Everything from all sitcom series...',
      'Join us and share with us the series you watch',
      'Our community is an interactive, multiplatform reading club that brings passionate readers together to discuss inspiring stories.',
      'Cant remember the title of a book you read? Come search our bookshelves. If you don’t find it there, post a description on our unsolved message board and we can try to help.',
      'If you love poetry too, this group is for you. Let s join!'];
    const content_type = ['GAME', 'MOVIE', 'SERIES', 'BOOK'];
    const tag = [['csgo', 'game', 'fps'], ['pc', 'game', 'fps'], ['rust', 'game'], ['starwars', 'movie'], ['anime', 'movie'], ['marvel', 'movie'], ['series', 'marvel'], ['sitcom', 'series'], ['series'], ['book', 'story', 'novel'], ['book'], ['book', 'poetry']];
    const websites = [
      'https://twitter.com/csgo_dose', '', 'https://rustypot.com/', 'https://www.starwars.com/', '', 'https://www.imdb.com/', 'https://www.marvel.com/tv-shows',
      'https://twitter.com/sitcomvalley', 'https://www.netflix.com/tr/browse/genre/83', 'https://books.google.com.tr/', '', 'https://poets.org/poems-poets',
    ];
    const rule = [
      'Cheating is prohibited', 'NO RULES', 'Everything is free with respect. Have fun!', 'Profanity and insults are reason for ban', 'NO SPOILERS', 'Swearing and spoilers are not allowed',
      'Insult is a reason for ban', 'NO RULES HAVE FUN!', 'Swearing is forbidden', 'Profanity and insults are reason for ban', 'Cursing and insults are prohibited', 'Insults are prohibited',
    ];

    for (let index = 0; index < 12; index++) {
      communities.push({
        organizers: index + 1,
        members: index + 1,
        image_id: index + 13,
        name: `SD/${names[index]}`,
        description: descriptions[index],
        content_types: content_type[Math.floor(index / 3)],
        tags: tag[index],
        website: websites[index],
        rules: rule[index],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('communities', communities);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('communities', {
      name: {
        [Sequelize.Op.startsWith]: 'SD/',
      },
    });
  },
};
