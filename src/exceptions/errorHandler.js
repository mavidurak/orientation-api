export default (error, req, res, next) => {
  res.header('Content-Type', 'application/json');
  res.status(error.statusCode).send(error.message);
};
