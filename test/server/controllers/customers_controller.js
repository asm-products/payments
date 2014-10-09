var expect = require('chai').expect;
var sinon = require('sinon');
var coRequest = require('co-request');
var stripe = require('../../../app/server/lib/stripe');
var supertest = require('supertest');
var app = require('../../../app/server');
var planPermissions = require('../../../app/server/middleware/plan_permissions');
var customerFixture = require('../../fixtures/customer.json');
var reset = require('../../reset');

describe('customers_controller', function() {
  before(function(done) {
    reset.dropDatabase(done);
  });

  afterEach(function(done) {
    reset.dropDatabase(done);
  });

  describe('create()', function() {
    var mockPermissions;

    before(function() {
      sinon.stub(stripe.customers, 'create', function *(body) {
        return yield customerFixture;
      });

      sinon.stub(coRequest, 'get', function *() {
        var auth = JSON.stringify({ authorized: true });
        return yield { body: auth };
      })
      // sinon.stub(planPermissions, 'authorization', function *(next) {
      //   yield next;
      // });
    });

    after(function() {
      stripe.customers.create.restore();
      // planPermissions.authorization.restore();
    });

    it('creates and saves a customer', function(done) {
      supertest(app.listen())
        .post('/products/test_product/customers')
        .send({ email: 'trillian@astra.com', card: '4242424242424242' })
        .expect(201, done);
    });
  });
});
