import express from 'express';
import EmployeeInfo from '../models/EmployeeInfo.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get Employee Info (Employee or Admin)
router.get('/:employeeId', verifyUser, async (req, res) => {
    try {
        const { employeeId } = req.params;
        
        // Check authorization
        if (req.user.role !== 'admin' && req.user._id.toString() !== employeeId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const info = await EmployeeInfo.findOne({ employeeId }).populate('employeeId', 'name email ProfileImage');
        
        if (!info) {
            return res.status(200).json({ success: true, message: "No info found", info: null });
        }

        res.status(200).json({ success: true, info });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ Upsert Employee Info (Admin only)
router.post('/upsert', verifyUser, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { employeeId, personal, address, education, employment } = req.body;

        const info = await EmployeeInfo.findOneAndUpdate(
            { employeeId },
            { personal, address, education, employment },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, message: "Info updated successfully", info });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
