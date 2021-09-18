module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  ignorePatterns: [
    'dist',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    semi: ['error', 'always'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-underscore-dangle': 'off',
    indent: ['error', 2],
    camelcase: 'off',
    'func-names': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
  },
};
