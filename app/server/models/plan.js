var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PlanSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  name: String,

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

module.exports = mongoose.model('Plan', PlanSchema);
