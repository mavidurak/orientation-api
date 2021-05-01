import 'colors';
import Sequelize from 'sequelize';
import { development as dbConfig } from './config/sequelize';

const connection = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  },
);

connection.authenticate()
  .then(() => {
    console.log(`🔗 ${`${dbConfig.dialect.toLocaleUpperCase()}/${dbConfig.database}`.green} connection success`);
  })
  .catch((err) => {
    console.log(`❌ ${err}`.red);
  });

export default connection;
