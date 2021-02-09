const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nanoid =  require('nanoid')
const schema = new Schema({
  shortUid:{
    type:String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },

  region: {
    type: String,
    required: true
  },
  acceptTerms: Boolean,

  subscriptionPeriod:{
    type: Number,
    default: 6
  },
  payed:{
    type:Boolean,
    default: true
  },
  role: {
    type: String,
    required: true
  },
  verificationToken: String,
  verified: Date,
  resetToken: {
    token: String,
    expires: Date
  },

  passwordReset: Date,

  operations: [{
    type: Schema.Types.ObjectID,
    ref: "Operation"
  }],
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date
});

schema.virtual('isVerified').get(function() {
  return !!(this.verified || this.passwordReset);
});

schema.virtual('fullName').get(function() {
  return (this.lastName + this.firstName).replace(/\s/g, '')
});

schema.pre('save', function(next) {
  this.shortUid = nanoid.nanoid(10)
  next();
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.passwordHash;
  }
});

module.exports = mongoose.model('Account', schema);
