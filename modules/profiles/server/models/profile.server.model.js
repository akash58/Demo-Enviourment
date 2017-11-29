'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Profile name',
    trim: true
  },
  lastName: {
    type: String,
    default: '',
    required: 'Please fill Last name',
    trim: true
  },
  contactNumber: {
    type: Number,
    default: '',
    // trim: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter only Number'],
    required: 'Contact Number Can Not Be Blank'
  },
  gender: {
    type: String,
    default: 'male',
    enum: ['Male', 'Female'],
    required: 'Gender Can Not Be Blank'
  },
  address: {
    type: String,
    default: '',
    required: 'Please fill Address',
    trim: true
  },
  note: {
    type: String,
    default: '',
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Profile', ProfileSchema);
