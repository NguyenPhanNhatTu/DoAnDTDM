const mongoose = require('mongoose');
const awsVar = require('aws-sdk');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Course = new Schema({
  name: { type: String, required: true },
  decriptions: { type: String, maxLength: 255 },
  image: { type: String, maxLength: 255 },
  videoID: { type: String, maxLength: 255, required: true },
  slug: { type: String, slug: 'name', unique: true }

}, {
  timestamps: true
});

// add plugin
mongoose.plugin(slug);
Course.plugin(mongooseDelete, {
  overrideMethods: 'all',
  deletedAt: true
});

module.exports = mongoose.model('Course', Course);