var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now
  },

  email: {
    type: String,
    required: true,
    index: true
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

module.exports = mongoose.model('Customer', CustomerSchema);
