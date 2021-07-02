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

  routes.forEach((route, index, array) => { // multiple router support
    if(Array.isArray(route)){
      route.forEach( r => array.push(r));
      array.splice(index,1);
    }
  });

export default routes