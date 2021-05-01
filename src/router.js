import express from 'express';
import routes from './routes';

const router = express.Router();

routes.forEach((route) => {
  const { prefix } = route;
  const subRouter = express.Router();
  route.inject(subRouter);
  router.use(prefix, subRouter);
});

export default router;
