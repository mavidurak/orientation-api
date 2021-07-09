module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const names = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Isabella'];
    const surnames = ['Smith', 'Johnson', 'Brown', 'Emma', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Walker'];
    const domains = ['yahoo', 'gmail', 'hotmail', 'msn', 'live', 'outlook'];

    for (let name, surname, random, domain, index = 0; index < 12; index++) {
      name = names[Math.floor(Math.random() * 10)];
      surname = surnames[Math.floor(Math.random() * 10)];
      domain = domains[Math.floor(Math.random() * 6)];
      random = Math.floor(Math.random() * 20);

      users.push({
        username: `SD/${name}_${surname + random}`, // SD(Seeder Data)
        email: `${surname}.${name}.${random}@${domain}.com`.toLowerCase(),
        name: `${name} ${surname}`,
        // user password is 12345678
        password_hash: '2a8c917119426cb8ea9aa2c6811e65100a8019d7143c5475a26995803242fcabb8d103c2d3523234f6c78aade88d84b75f3077c6b0c8d7d7cb00e1b78150d30a',
        password_salt: 'd446421b9d7d',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('users', users);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      username: {
        [Sequelize.Op.startsWith]: 'SD/',
      },
    });
  },
};
