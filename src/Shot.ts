import mongoose from "mongoose";
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

export default  mongoose.model("lastShot", lastShot);
