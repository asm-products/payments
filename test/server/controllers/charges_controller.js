var app = require('../../../app/server');
var coRequest = require('co-request');
var expect = require('chai').expect;
var reset = require('../../reset');
var sinon = require('sinon');
var stripe = require('../../../app/server/lib/stripe');
var supertest = require('supertest');

var Customer = require('../../../app/server/models/customer');

describe('charges_controller', function() {
  afterEach(function(done) {
    reset.dropDatabase(done);
  });

  describe('create()', function() {
    before(function(done) {
      sinon.stub(coRequest, 'get', function *() {
        return yield { body: JSON.stringify({ authorized: true }) };
      });

      sinon.stub(stripe.charges, 'create', function *(body) {
        return yield require('../../fixtures/create_charge.json');
      });

      Customer.create({stripe_id: 'cus_1234', email: 'test@example.com', product_id: 'test_product'}, done);
    });

    after(function() {
      coRequest.get.restore();
      stripe.charges.create.restore();
    });

    it('creates a new charge in Stripe', function(done) {
      supertest(app.listen())
        .post('/products/test_product/charges')
        .send({
          amount: 400,
          currency: "usd",
          customer: "cus_1234",
          description: "Charge for test@example.com"
        })
        .expect(/ch_14nG8y2eZvKYlo2C1kjaD56E/)
        .expect(201, done);
    });
  });

  describe('index()', function() {
    before(function() {
      sinon.stub(coRequest, 'get', function *() {
        return yield { body: JSON.stringify({ authorized: true }) };
      });

      sinon.stub(stripe.charges, 'list', function *(body) {
        return yield require('../../fixtures/list_charges.json');
      });
    });

    after(function() {
      stripe.charges.list.restore();
      coRequest.get.restore();
    });

    it('returns a list of charges', function(done) {
      supertest(app.listen())
        .get('/products/test_product/charges')
        .expect(200, done);
    });

  });
});
