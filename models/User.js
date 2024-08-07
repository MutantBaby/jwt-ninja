const mongoose = require("mongoose");
const validator = require("validator");

const { genPassword } = require("../utils");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please Enter an Email"],
    lowercase: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    minlength: [6, "Minimum Length is 6 Characters"],
    required: [true, "Please Enter a Password"],
  },
  salt: String,
});

// fire a func before doc/res saved to db
userSchema.pre("save", function (next) {
  console.log("User About to be Created & Saved", this);

  const { salt, hash } = genPassword(this.password);

  this.salt = salt;
  this.password = hash;

  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
