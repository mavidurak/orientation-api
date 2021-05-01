export default (req, res, next) => {
  let path = req._parsedUrl.pathname;
  if (!path.endsWith('/')) {
    path += '/';
  }
  req.fixed_path = path;

  next();
};
