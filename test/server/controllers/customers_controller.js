var expect = require('chai').expect;
var sinon = require('sinon');
var stripe = require('../../../app/server/lib/stripe');
var supertest = require('supertest');
var app = require('../../../app/server');
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
    before(function() {
      sinon.stub(stripe.customers, 'create', function *(body) {
        return yield customerFixture;
      });
    });

    after(function() {
      stripe.customers.create.restore();
    });

    // There is a lot to stub here
    it('creates and saves a customer', function(done) {
      supertest(app.listen())
        .post('/products/test_product/customers')
        .send({ email: 'trillian@astra.com', card: '4242424242424242' })
        .expect(201, done);
    });
  });
});
