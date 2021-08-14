export const WHITE_LIST = [
  // ['METHOD', 'PATH']
  ['GET', '/health-check/'],
  ['POST', '/authentication/login/'],
  ['POST', '/authentication/register/'],
  ['GET', '/authentication/email-confirmation/'],
  ['POST', '/authentication/forgot-password/'],
  ['POST', '/authentication/reset-password/'],
];

export const ACCESS_TOKEN_KEY = 'x-access-token';

export const SECRET_KEY = process.env.SECRET_KEY || 'mi3sjsQDwdEFm655LBu8URhk2fTjb34u';
