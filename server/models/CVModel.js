const mongoose = require('mongoose');

const CVSchema = new mongoose.Schema({
  originalFileName: String,
  formattedCV: String,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CV', CVSchema);
