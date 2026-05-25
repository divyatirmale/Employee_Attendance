import express from "express";
import { login, verifyToken, registerEmployee, getAllEmployees, registerAdmin, getAllAdmins, updateProfile } from "../controllers/authcontrollers.js";
import verifyUser from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/login", login);
router.get("/verify", verifyToken); // ✅ Fixed: Now uses proper verifyToken logic
router.post("/register-employee", registerEmployee); // ✅ New route for Admin
router.get("/employees", getAllEmployees); // ✅ Fetch all employees
router.post("/register-admin", registerAdmin); // ✅ New route for Admin Management
router.get("/admins", getAllAdmins); // ✅ Fetch all admins
router.put("/update-profile/:id", updateProfile); // ✅ Update user profile

// ✅ PROFILE IMAGE UPLOAD
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/profiles';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/upload-image/:id", upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(id, { ProfileImage: imageUrl }, { new: true });
    res.json({ success: true, imageUrl, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading image" });
  }
});


// ✅ Change Password
router.post('/change-password', verifyUser, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid old password" });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;