/* global __dirname:true */

var fs   = require('fs'),
    path = require('path'),
    mongojs = require('mongojs');

function initialize(server, logger) {

  server.get('/', function (req, res, next) {
    res.send({ 'message': 'Restify is online and operational.' });
    return next();
  });

};

var routes = [
  'test',
  'products'
];

module.exports = function(server, logger, database) {
  initialize(server, logger);

  routes.forEach(function (route) {
    try {
      require(path.join(__dirname, route))(server, logger, database);
    } catch (err) {
      throw new Error("Can't load '" + route + "' route");
    }
  });
};
