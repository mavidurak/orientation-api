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
    const sluges = ['csgodose-2da1b6d1', 'pc-gamer-68a0295a', 'rustypot-a6b6892f', 'star-wars-5011f733', 'anime-fan-club-c477f1bf', 'movie-nights-51c3bd2d', 'marvel-series-1b275181', 'sitcom-valley-7f7fa23d', 'series-e72204a6',
      'book-lovers-06282c18', 'what-is-the-name-of-that-book-350405af', 'poem-in-street-1d741d5d'];

    for (let index = 0; index < 12; index++) {
      const organizers = []; let members = [];
      const organizersLenght = Math.floor(Math.random() * 10) + 1;
      const membersLenght = Math.floor(Math.random() * 12) + 1;
      let id;

      for (let a = 0; a < organizersLenght; a++) {
        id = Math.floor(Math.random() * 12) + 1;
        if (!organizers.includes(id)) {
          organizers[a] = id;
        } else {
          a--;
        }
      }
      for (let a = 0; a < membersLenght; a++) {
        id = Math.floor(Math.random() * 12) + 1;
        if (!members.includes(id)) {
          members[a] = id;
        } else {
          a--;
        }
      }
      members = [...new Set(members.concat(organizers))];
      communities.push({
        organizers,
        members,
        image_id: index + 13,
        name: `SD/${names[index]}`,
        description: descriptions[index],
        content_types: content_type[Math.floor(index / 3)],
        tags: tag[index],
        website: websites[index],
        rules: rule[index],
        slug: sluges[index],
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
