module.exports = function(server, logger) {
  // List Products
  server.get('/products', function (req, res, next) {
    res.send({ 'result': 'test' });
    return next();
  });
};
