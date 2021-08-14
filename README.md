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
│   └── <timestamp-name>.js
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
        ├── encription.js
        ├── generateSlug.js
        └── sendEmail.js

        

```


## Install
```bash
git clone https://github.com/mavidurak/orientation-api.git
cd orientation-api
```
## Setup
Install dependencies
```bash
npm install
```
## Set environment variables
Copy [sample.env](./sample.env) file then changes values.
```bash
cp sample.env .env
```

```
APP_PORT=4000
DATABASE=mavidurak
TEST_DATABASE=mavidurak_test
DATABASE_USERNAME=root
DATABASE_PASSWORD=
DATABASE_HOST=localhost
API_PATH=http://localhost:4000
DASHBOARD_UI_PATH=http://localhost:8080
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
EMAIL_USER=
EMAIL_PASSWORD=
```

[Send mail with smtp.gmail](https://support.google.com/mail/answer/7126229?visit_id=637363760481005370-2213185597&hl=tr&rd=1). If you use smtp.google, ```EMAIL_SECURE=```is must be ```true```,
[Send mail with smtp.office365.com](https://support.microsoft.com/tr-tr/office/pop-imap-ve-smtp-ayarlar%C4%B1-8361e398-8af4-4e97-b147-6c6c4ac95353). If you use smtp.office365.com, ```EMAIL_SECURE=```leave blank.

## Migrate
Create database then migrate it
```bash
npm run migrate
```
## Seed
Insert random data into database
```bash
npm run seed
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
