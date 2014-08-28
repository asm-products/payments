var mongoose = require('mongoose');
var request = require('co-request');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PlanSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now
  },

  name: String,

  product_id: {
    type: String,
    index: true,
    required: true
  },

  stripe_id: {
    type: String,
    index: true,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Plan', PlanSchema);
