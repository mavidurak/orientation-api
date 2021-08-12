module.exports = {
  up: async (queryInterface, Sequelize) => {
    const discussions = [];
    const headers = ['1984', 'Nausea', 'Fahrenheit 451', 'Blindness', 'Crime and Punishment', 'The Awakening', 'Madame Bovary', 'White Nights', 'Pride and Prejudice', 'The Idiot ', 'Trial', 'Sapiens'];
    const texts = ['Discuss Winston as a heroic figure. What qualities does he posses that could define him as one?',
      'Did depressing, existential works like this contribute to other readers confusion about life with no meaning?',
      'Do you believe, as Montag did, that Beatty wanted to die? If so, why do you think so?',
      'How does Saramago bring out the best and worst characteristics of human nature within the same text? How successful has he been in this respect?',
      'Compare the characters of Roskolnikov, Luzhin, and Svidrigailov. How is each of these men a "villain," and to what extent are they guilty? How does each man face his guilt, and how does each suffer for it?',
      'Why is Edna uncomfortable with the Creole culture? What does that reveal about Edna?',
      'The time between the onset of the French Revolution (1789) and WWI is often described as the era of the middle class. How is this central to the commentary of Madame Bovary?',
      'What is your impression of the young woman?',
      'Is Elizabeth Bennet consistent in her actions? Is she a fully developed character? How so?',
      'Why is Myshkin so drawn to suffering people?',
      'Why does Josef K. decide to “play along” with his arrest, even though the men who arrest him never show him any proof of their authority and he thinks it might be a “farce”?',
      'Dr. Harari describes several circumstances where we can see the impact of evolution in current day behaviors. Were any of them particularly surprising, highlighting a connection you hadn’t considered before? Were there any that you disagree with?'];
    for (let index = 0; index < 12; index++) {
      discussions.push({
        user_id: index + 1,
        community_id: index+1,
        header: `SD/${headers[index]}`,
        text: texts[index],
        is_private: Math.random() > 0.5,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('discussions', discussions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('discussions', {
      header: {
        [Sequelize.Op.startsWith]: 'SD/',
      },
    });
  },
};
