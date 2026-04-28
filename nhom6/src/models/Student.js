const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  score: { type: Number, min: 0, max: 100, default: 0 },
  major: {
    type: String,
    enum: ["IT", "Business", "Design", "Marketing"]
  },
  enrollmentDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Student", studentSchema);