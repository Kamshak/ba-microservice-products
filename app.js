/* global process:true, __dirname:true */

'use strict';

var path    = require('path'),
    restify = require('restify'),
    config  = require('config'),
    routes  = require('./routes'),
    jwt     = require('restify-jwt'),
    mongojs = require('mongojs');


exports.createServer = createServer;

restify.CORS.ALLOW_HEADERS.push('authorization');

/*
 * Set up server
 * @return the created server
 */
function createServer (logger) {

  var settings = {
    name: (config.has('server.name') && config.get('server.name'))
            ? config.get('server.name')
            : require(path.join(__dirname, 'package')).name
  };

  if (logger) settings.log = logger;

  var server = restify.createServer(settings);
  server.use(restify.CORS());
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());
  server.use(jwt({
    secret: config.get('server.secret'),
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring (req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
          return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
  }));

  server.on('NotFound', function (req, res, next) {
    if (logger) {
      logger.debug('404', 'No route that matches request for ' + req.url);
    }
    res.send(404, req.url + ' was not found');
  });

  if (logger) server.on('after', restify.auditLogger({ log: logger }));

  var mongoUrl = config.get("server.mongoUrl");
  logger.info("Connecting to MongDB " + mongoUrl);
  var db = mongojs(mongoUrl);
  db.on('error', function (err) {
    logger.error(err);
  });
  db.on('connect', function() {
    logger.info("Connected to MongoDB");
  });
  routes(server, logger, db);

  return server;
}
