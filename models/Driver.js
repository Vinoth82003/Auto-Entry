const mongoose = require("mongoose");

const loadSchema = new mongoose.Schema({
  in: Boolean,
  out: Boolean,
  date: {
    type: Date,
    default: Date.now,
  },
});

const driverSchema = new mongoose.Schema({
  name: String,
  qrLink: String,
  vehicle: String,
  phone: Number,
  noplate: String,
  loads: [loadSchema],
  totalLoad: { type: Number, default: 0 },
});

module.exports = mongoose.model("Driver", driverSchema);

