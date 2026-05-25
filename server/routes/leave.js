import express from "express";
import Leave from "../models/Leave.js";
import verifyUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply for leave
router.post("/apply", verifyUser, async (req, res) => {
    try {
        const { leaveType, fromDate, toDate, reason } = req.body;
        const newLeave = new Leave({
            employeeId: req.user._id,
            leaveType,
            fromDate,
            toDate,
            reason
        });
        await newLeave.save();
        res.status(201).json({ success: true, message: "Leave applied successfully! ✅" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get leaves (for employee or admin)
router.get("/", verifyUser, async (req, res) => {
    try {
        let leaves;
        if (req.user.role === 'admin') {
            leaves = await Leave.find().populate('employeeId', 'name email');
        } else {
            leaves = await Leave.find({ employeeId: req.user._id });
        }
        res.status(200).json({ success: true, leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update leave status (Admin only)
router.put("/:id", verifyUser, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Only admins can update leave status" });
        }
        const { status } = req.body;
        const leave = await Leave.findByIdAndUpdate(req.params.id, { 
            status, 
            updatedAt: Date.now() 
        }, { new: true });
        res.status(200).json({ success: true, leave });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
