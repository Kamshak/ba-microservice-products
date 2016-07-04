/* global describe:true, before:true, after:true, it:true, baseURL:true */

'use strict';

var should  = require('chai').should(),
    request = require('supertest'),
    config = require('config');
var jwt = require('jsonwebtoken');


describe("/products", function () {
  it('should return an array', function(done) {
    request(baseURL)
      .get('/products')
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + jwt.sign({identity: '0000-0000-0000-0000'}, config.get('server.secret')))
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        res.body.should.be.an('array');

        return done();
      });
  });

  it('should return return the inserted product', function (done) {
    request(baseURL)
      .post('/products')
      .set('Authorization', 'JWT ' + jwt.sign({identity: '0000-0000-0000-0000'}, config.get('server.secret')))
      .set('Accept', 'application/json')
      .send({name: "Test Product", price: 321, color: "Red"})
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        res.body.should.be.an('object');
        res.body.should.have.ownProperty('_id');
        res.body.should.have.ownProperty('name');
        res.body.name.should.equal("Test Product");

        return done();
      });
  });

});
