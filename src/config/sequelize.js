const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;

module.exports = {
  development: {
    username,
    password,
    database,
    host,
    dialect: 'postgres',
  },
  test: {
    username,
    password,
    database,
    host,
    dialect: 'postgres',
  },
  production: {
    username,
    password,
    database,
    host,
    dialect: 'postgres',
  },
};
