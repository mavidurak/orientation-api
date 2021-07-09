module.exports = {

  up: async (queryInterface, Sequelize) => {
    const wantedContents = [];
    //const status = ['Wants to read', 'Read', 'Didn\'t read'];
    for (let index = 0; index < 12; index++) {
      wantedContents.push({
        user_id: index + 1,
        content_id:index+1,
        status: "X",
        my_score: Math.floor(Math.random() * 11),
        created_at: new Date().setyear(2001),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('wanted_contents', wantedContents);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('wanted_contents',{
      created_at: new Date().setyear(2001),
    });
  },
};
