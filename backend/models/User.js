const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileSchema = new mongoose.Schema(
  {
    gender: { type: String, enum: ["male", "female", null], default: null },
    age: { type: Number, min: 10, max: 100, default: null },
    height: { type: Number, min: 100, max: 250, default: null },
    weight: { type: Number, min: 30, max: 300, default: null },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", null],
      default: null,
    },
    bmi: { type: Number, default: null },
    bmiCategory: { type: String, default: null },
    bmr: { type: Number, default: null },
    tdee: { type: Number, default: null },
    targetCalories: { type: Number, default: null },
    goal: { type: String, default: null },
  },
  { _id: false },
);

const aiHistorySchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now },
    source: { type: String, default: "gemini" },
    ingredientsRaw: { type: String, default: "" },
    note: { type: String, default: "" },
    result: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

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
    profile: { type: profileSchema, default: () => ({}) },
    aiHistory: { type: [aiHistorySchema], default: [] },
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
