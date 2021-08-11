module.exports = {
  up: async (queryInterface, Sequelize) => {
    const comments = [];
    const texts = [
      'Discuss Winstonlaudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium as a heroic figure. What qualities does he posses that could define him as one?',
      'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et',
      'quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione',
      'non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati',
      'harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et',
      'doloribus at sed quis culpa deserunt consectetur qui praesentium\naccusamus fugiat dicta\nvoluptatem rerum ut voluptate autem\nvoluptatem repellendus aspernatur dolorem in',
      'maiores sed dolores similique labore et inventore et\nquasi temporibus esse sunt id et\neos voluptatem aliquam\naliquid ratione corporis molestiae mollitia quia et magnam dolor',
      'ut voluptatem corrupti velit\nad voluptatem maiores\net nisi velit vero accusamus maiores\nvoluptates quia aliquid ullam eaque',
      'deleniti aut sed molestias explicabo\ncommodi odio ratione nesciunt\nvoluptate doloremque est\nnam autem error delectus',
      'repudiandae repellat quia\nsequi est dolore explicabo nihil et\net sit et\net praesentium iste atque asperiores tenetur',
      'quia incidunt ut\naliquid est ut rerum deleniti iure est\nipsum quia ea sint et\nvoluptatem quaerat eaque repudiandae eveniet aut',
      'fugit harum quae vero\nlibero unde tempore\nsoluta eaque culpa sequi quibusdam nulla id\net et necessitatibus'];
    const types = [
      'content_review_id',
      'discussion_id',
      'parent_comment_id'];

    for (let type, content_review_id, discussion_id, parent_comment_id,
      index = 0; index < 12; index++) {
      type = types[Math.floor(Math.random() * 3)];
      if (type === 'content_review_id') {
        content_review_id = Math.floor(Math.random() * 12) + 1;
        discussion_id = null;
        parent_comment_id = null;
      } else if (type === 'discussion_id') {
        discussion_id = Math.floor(Math.random() * 12) + 1;
        content_review_id = null;
        parent_comment_id = null;
      } else {
        parent_comment_id = Math.floor(Math.random() * 12) + 1;
        discussion_id = null;
        content_review_id = null;
      }

      comments.push({
        user_id: index + 1,
        text: texts[index],
        is_spoiler: Math.random() > 0.5 ? true :false,
        content_review_id,
        discussion_id,
        parent_comment_id,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('comments', comments);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('comments');
  },
};
