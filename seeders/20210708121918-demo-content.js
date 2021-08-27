module.exports = {
  up: async (queryInterface, Sequelize) => {
    const contents = [];
    const names = ['League of Legends', 'Valorant', 'Counter-Strike: Global Offensive', 'Pianist', 'The Matrix', 'Inception', '11.22.63', 'Friends', 'Dark', '1984', 'A Clockwork Orange', 'The Land of the White Lilies'];
    const descriptions = [
      'League of Legends is a team-based strategy game where two teams of five powerful champions face off to destroy the others base.',
      'Valorant is a tactical shooting game involving two teams with 5 players in each team.',
      'Counter-Strike: Global Offensive (CS:GO) is a multiplayer first-person shooter developed by Valve and Hidden Path Entertainment.',
      'A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.',
      'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      'A high school teacher travels back in time to prevent John F. Kennedys assassination.',
      'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.',
      'A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.',
      'Big Brother controls every aspect of peoples lives',
      'Set in a dismal dystopian England, it is the first-person account of a juvenile delinquent who undergoes state-sponsored psychological rehabilitation for his aberrant behaviour.',
      'Finland, the country of white lilies is a journalistic book by Russian priest and social activist Grigory Spiridonovich Petrov.',
    ];
    const types = ['GAME', 'MOVIE', 'SERIES', 'BOOK'];
    const sluges = ['sd-league-of-legends-1cbaaa94', 'sd-valorant-b91adf16', 'sd-counter-strike-global-offensive-c526ffcd', 'sd-pianist-5ce6f238', 'sd-the-matrix-642f5ae8', 'sd-inception-f11b0d97', 'sd-112263-c0300ede',
      'sd-friends-2c214074', 'sd-dark-53336bf1', 'sd-1984-f403a659', 'sd-a-clockwork-orange-ea5ddddf', 'sd-the-land-of-the-white-lilies-1185991b'];

    for (let name, description, type, views, rate, slug, index = 0; index < 12; index++) {
      name = names[index];
      description = descriptions[index];
      type = types[Math.floor(index / 3)];
      views = Math.floor(Math.random() * 1001);
      rate = Number((Math.random() * 10).toFixed(1));
      slug = sluges[index];

      contents.push({
        user_id: index + 1,
        image_id: index + 1,
        name: `SD/${name}`,
        description,
        type,
        views,
        rate,
        slug,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('contents', contents);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('contents', {
      name: {
        [Sequelize.Op.startsWith]: 'SD/',
      },
    });
  },
};
