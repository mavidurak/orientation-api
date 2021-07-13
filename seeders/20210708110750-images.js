module.exports = {
  up: async (queryInterface, Sequelize) => {
    const images = [];
    const names = ['the100', 'the witcher', 'black mirror', 'dark', 'lost in space', 'snowpiercer', 'legion', 'altered carbon', 'Mr.Nobody', 'passengers', 'interstaller', 'breaking bad'];
    const paths = ['https://tr.web.img4.acsta.net/pictures/14/02/16/23/53/181925.jpg?coixp=50&coiyp=39',
      'https://cdn.dsmcdn.com/mnresize/415/622/ty3/product/media/images/20201013/18/15566034/92933130/1/1_org_zoom.jpg',
      'https://izleryazar.com/wp-content/uploads/2016/10/Black-Mirror-Afi%C5%9F.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf7YfvSOtuOAKXiAC3AxssnJq2ShPo4JrGHzM6xu1ocn2xyaVPL6c4nqIuQ7Cbw8-dnlA&usqp=CAU',
      'https://images-na.ssl-images-amazon.com/images/I/51Dw5rhu-PL._AC_SY780_.jpg',
      'https://matyafilm.com/wp-content/uploads/2020/02/Snowpiercer-630x910-1.jpg',
      'https://cdn.dsmcdn.com/mnresize/415/622/ty15/product/media/images/20201014/18/15778201/93357171/1/1_org_zoom.jpg',
      'https://mcdn01.gittigidiyor.net/57957/579571889_0.jpg',
      'https://i.pinimg.com/originals/75/8b/5c/758b5c23950ae3ee6a432a6bdbdb5091.jpg',
      'https://cdn.dsmcdn.com/mnresize/415/622/ty8/product/media/images/20201016/15/16482756/94048189/1/1_org_zoom.jpg',
      'https://tr.web.img2.acsta.net/pictures/14/10/09/15/52/150664.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW6sTSkb00QsGh5p8RyAlqs7ACzaGuBomuUp3cnqcAHRh5OlVMuSEwwRGzJHMT6TvXwEY&usqp=CAU'];

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
