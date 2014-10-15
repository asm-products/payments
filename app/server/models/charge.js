var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChargeSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    required: true
  },

  product_id: {
    type: String,
    required: true
  },

  stripe_id: {
    type: String,
    index: true,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Charge', ChargeSchema);
