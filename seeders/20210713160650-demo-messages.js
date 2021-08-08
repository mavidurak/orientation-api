module.exports = {

  up: async (queryInterface, Sequelize) => {
    const messages = [];
    const texts = [
      'Yolumuz uzun, heyecanımız yüksek, gençliğimiz var.',
      'Hak yemedim yemem, hakkımı da yedirtmem.',
      'Yeryüzündeki bütün çiçekleri koparabilirsiniz, ama baharın gelmesini engelleyemezsiniz',
      'Kırmızısı yoktur aşkın… Ya sarıdır ya lacivert.',
      'Büyüklük geçmişte gizlidir büyük takım mazisinden bellidir.',
      'Bu hayat bitecek elbet sonunda ölüm gelecek şu yaralı kalbim son nefesinde Fener diyecek.',
      'Pişmanlık asla kaçamayacağın bir canavar; elleri bazen öldürür, bazen sertçe yakalar',
      'Karıştı yarınım bitti dün, tedirgin bugün.',
      'İstanbul kalem harp okulundan çıktı en baba Rap işte başına darısı',
      'Beni görmek demek mutlaka yüzümü görmek demek değildir. Benim fikirlerimi, benim duygularımı anlıyorsanız ve hissediyorsanız bu yeterlidir.',
      'Şuna inanmak gerekir ki, dünya yüzünde gördüğümüz her şey kadının eseridir.',
      'Yurtta sulh, cihanda sulh.',

    ];
    for (let index = 0; index < 12; index++) {
      messages.push({
        from: index + 1,
        to: Math.floor(Math.random() * 13),
        text: `SD/${texts[index]}`,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('messages', messages);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('messages', {
      text: {
        [Sequelize.Op.startsWith]: 'SD/',
      },
    });
  },
};
