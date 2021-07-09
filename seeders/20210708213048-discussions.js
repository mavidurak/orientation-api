module.exports = {
    up: async (queryInterface, Sequelize) => {
      const discussions = [];
      const headers =['header1','header2','header3','header4','header5','header6','header7','header8','header9','header10','header11','header12'];
      const texts = ['text1','text2','text3','text4','text5','text6','text7','text8','text9','text10','text11','text12'];
      const is_privates =[ true, false];
      for (let header, text,is_private, index = 0; index < 12; index++) {
        header=headers[index];
        text=texts[index];
        is_private = is_privates[Math.floor(Math.random() * 2)];
        discussions.push({
            user_id:index+1,
            header:`SD/${header}`,
            text:`${text}`,
            is_private:is_private,
            created_at: new Date(),
            updated_at: new Date(),
        });
      }
  
      await queryInterface.bulkInsert('discussions', discussions);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('discussions',{
      header: {
        [Sequelize.Op.startsWith]: 'SD/',
      }
    });
    },
  };