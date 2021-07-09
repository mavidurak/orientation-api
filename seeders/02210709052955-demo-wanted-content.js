module.exports = {

  up: async (queryInterface, Sequelize) => {
    const wantedContents = [];
    const status = ['Wants to read', 'Read', 'Didn\'t read'];
    for (let statu, myScore, index = 0; index < 6; index++) {
      statu = status[Math.floor(Math.random() * 3)];
      myScore = Math.floor(Math.random() * 11);

      wantedContents.push({
        user_id: index + 1,
        status: `${statu}`,
        my_score: myScore,
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
