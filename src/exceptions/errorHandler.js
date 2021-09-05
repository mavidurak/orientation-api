export default (error, req, res) => {
  res.header('Content-Type', 'application/json');
  res.status(error.statusCode).send(error.message);
};
