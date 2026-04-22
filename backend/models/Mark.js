const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Mark', markSchema);
