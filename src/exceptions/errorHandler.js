// This function handle HTTPError or internal packages errors
/* eslint-disable */
export default (error, req, res, next) => {
  res.header('Content-Type', 'application/json');
  // Sequelize error doesn't have "statusCode" key so we chack it and stringfy the error message.
  error.message = Array.isArray(error.message.errors) ? error.message : { errors: [{ message: error.message }] };
  res.status(error.statusCode || 500).send(error.message);
};
