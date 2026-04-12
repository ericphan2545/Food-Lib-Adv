const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Email not invalid",
      },
    },
    username: { type: String, unique: true, required: true, trim: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function validatePassword(v) {
          return String(v || "").length >= 5;
        },
        message: "Weak Pasword",
      },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function preSave() {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
