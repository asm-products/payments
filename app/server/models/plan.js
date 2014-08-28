var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PlanSchema = new Schema({
  // required by Stripe
  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: 'usd'
  },

  name: {
    type: String,
    required: true,
    index: true,
    unique: true
  },

  // optional for stripe
  interval_count: Number,
  trial_period_days: Number,
  metadata: Object,
  statement_description: String,

  // required for payments
  product_id: {
    type: String,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plan', PlanSchema);
