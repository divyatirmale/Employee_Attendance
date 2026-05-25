import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Half-Day", "Holiday", "Leave"],
    default: "Present"
  },
  shift: {
    type: String,
    default: "GEN"
  },
  checkIn: { type: String },
  checkOut: { type: String },
  workHours: { type: String, default: "09:30" }
}, { timestamps: true });

// Ensure unique attendance per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
