import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    enum: ["Qualification", "Accounts & Statutory", "Personal", "Other"],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Document = mongoose.model("Document", documentSchema);
export default Document;
