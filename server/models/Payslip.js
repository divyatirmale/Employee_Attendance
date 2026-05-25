import mongoose from "mongoose";

const payslipSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  month: {
    type: String, // e.g. "Feb"
    required: true
  },
  year: {
    type: Number, // e.g. 2026
    required: true
  },
  earnings: {
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    telephoneAndInternet: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 }
  },
  deductions: {
    pf: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 }
  },
  netPay: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payslip = mongoose.model("Payslip", payslipSchema);
export default Payslip;
