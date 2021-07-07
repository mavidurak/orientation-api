import models from '../models';

import {
  ACCESS_TOKEN_KEY,
  WHITE_LIST,
} from '../constants/api';

export default async (req, res, next) => {
  const is_ignored = WHITE_LIST.findIndex(
    (path) => path === req.fixed_path,
  ) > -1;

  const accessToken = req.get(ACCESS_TOKEN_KEY);

  if (accessToken) {
    const data = await models.tokens.findOne({
      where: {
        value: accessToken,
      },
      include: [
        {
          model: models.users,
          as: 'user',
        },
      ],
    });

    if (data && !data.isExpired()) {
      req.user = data.user.toJSON();
    }
  }

  if (is_ignored || req.user) { return next(); }

  res.send(
    401,
    {
      message: 'You must be login to access here',
    },
  );
};
