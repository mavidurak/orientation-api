/* eslint-disable */
import fs from 'fs';

let routes = fs.readdirSync(__dirname) // read all files and folders into 'src/routes'
  .map(route => {
    if (route !== 'index.js') { // ignore 'index.js'
      return require(`./${route}`).default; // import route
    }
  })
  .filter(route => // filter all crash routes
    route !== {} && route !== undefined && route !== null
  );

export default routes