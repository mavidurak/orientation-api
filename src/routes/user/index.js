export default {
  prefix: '/d',
  inject: (router) => {
    router.get('/a', (req, res) => { res.send('calisiyor layn'); });
  },
};
