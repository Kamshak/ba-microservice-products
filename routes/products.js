module.exports = function(server, logger, db) {
  var products = db.collection("products");

  // List Products
  server.get('/products', function (req, res, next) {
    if (!req.user) {
      res.send(403, {"message": "You are not authorized to access this resource"});
      return next();
    }

    products.find({}, function(err, response) {
      if (err) {
        res.send(500, {"message": "Error reading from the database"});
        return next();
      }

      res.send(response);
      return next();
    })
  });

  server.post('/products', function (req, res, next) {
    if (!req.user) {
      res.send(403, {"message": "You are not authorized to access this resource"});
      return next();
    }

    logger.debug(req.body);
    products.save(req.body, function(err, doc) {
      if (err) {
        res.send(500, {"message": "Error saving to the database"});
        return next();
      }

      res.send(200, doc);
      return next();
    })
  });
};
