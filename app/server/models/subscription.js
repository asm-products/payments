var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var SubscriptionSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now
  },

  ended_at: {
    type: Date,
    default: null
  },

  plan: {
    type: ObjectId,
    ref: 'Plan',
    required: true
  },

  product_id: {
    type: String,
    required: true
  },

  stripe_customer_id: {
    type: String,
    required: true
  },

  stripe_id: {
    type: String,
    required: true,
    index: true,
    unique: true
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
