# orientation-api

```bash
.
├── .babelrc # Babel config
├── .eslintrc.js # ESLint config
├── .sequelizerc # Sequelize config
├── CONTRIBUTING.md 
├── docs
│   └── ...
├── hooks // Git hooks
│   └── pre-commit
├── LICENSE
├── migrations
│   └── <timestamp-name>.js
├── nodemon.json # Nodemon config
├── package.json
├── package-lock.json
├── README.md
├── sample.env # Sample environment variables file
├── seeders
│   └── <model_name>.js
└── src
    ├── config
    │   └── sequelize.js # Database config
    ├── constants
    │   └── api.js
    ├── joi.js # For Joi multiple error
    ├── models
    │   ├── index.js
    │   └── <modelName>.js
    ├── pre_handlers
    │   ├── authantication.js
    │   ├── complatePath.js
    │   └── index.js
    ├── router.js
    ├── routes
    │   ├── <routeName>
    │   │   └── index.js
    │   └── index.js
    ├── sequelize.js # Database connection
    ├── server.js # Server start point
    └── utils
        └── encription.js

```


## Install
```bash
git clone https://github.com/mavidurak/orientation-api.git
cd orientation-api
```
## Setup
```bash
npm install
```
## Set environment variables
Copy [sample.env](./sample.env) file then changes values.
```bash
cp sample.env .env
```
## Migration
Create database then migrate it
```bash
npm run migrate
```
## Start
```bash
npm start
```
## Lint
```bash
npm run lint
```
## Build Hooks
Build git hooks
```bash
npm run build-hooks
```
## Build Code
```bash
npm run build
```

## Contributing
[CONTRIBUTING.md](CONTRIBUTING.md)

## Docs
[docs/docs.md](docs/docs.md)

## License
[GNU General Public License v3.0](LICENSE)
