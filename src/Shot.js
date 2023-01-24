const mongoose = require("mongoose");
const lastShot = new mongoose.Schema({
  shotID: {
    type: String,
    required: true,
  },
  access: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("lastShot", lastShot);
