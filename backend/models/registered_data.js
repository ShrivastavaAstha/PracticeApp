const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, trim: true },
    dob: { type: String, required: true, trim: true },
    contact: { type: Number, required: true },
  },
  { timestamps: true }
);
const registermodel = mongoose.model("registered_data", registerSchema);
module.exports = registermodel;
