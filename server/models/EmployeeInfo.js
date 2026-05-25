import mongoose from "mongoose";

const employeeInfoSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  personal: {
    bloodGroup: { type: String, default: "" },
    dob: { type: Date },
    nationality: { type: String, default: "Indian" },
    maritalStatus: { type: String, default: "Single" },
    marriageDate: { type: Date },
    gender: { type: String, default: "" },
    religion: { type: String, default: "" },
    physicallyChallenged: { type: String, default: "No" },
    hobby: { type: String, default: "" }
  },
  address: {
    current: { type: String, default: "" },
    permanent: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" }
  },
  education: {
    degree: { type: String, default: "" },
    institute: { type: String, default: "" },
    yearOfPassing: { type: String, default: "" },
    grade: { type: String, default: "" }
  },
  employment: {
    designation: { type: String, default: "" },
    department: { type: String, default: "" },
    location: { type: String, default: "" },
    joiningDate: { type: Date }
  }
}, { timestamps: true });

const EmployeeInfo = mongoose.model("EmployeeInfo", employeeInfoSchema);
export default EmployeeInfo;
