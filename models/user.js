const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // datamodels over here
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: 
    {
      type: [String],
      default: ["Employee"],
    },
    active: {
      type: Boolean,
      default: true
  }
 
});

module.exports = mongoose.model("user", userSchema);
