/* eslint-disable */
import fs from 'fs';

let routes = fs.readdirSync(__dirname) // read all files and folders into 'src/routes'
  .filter(file => file !== 'index.js') //ignore index.js
  .map(route =>
    require(`./${route}`).default // import route
  );

routes.forEach((route, index, array) => { // multiple router support
  if (Array.isArray(route))
    route.forEach(r => array.push(r));
});

routes = routes.filter(route => // filter all crash routes ({}, null, undefined, [*])
  route !== {} && !Array.isArray(route)
);

export default routes