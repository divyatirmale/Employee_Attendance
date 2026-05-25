import express from 'express';
import Attendance from '../models/Attendance.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get Attendance for an Employee (Employee or Admin)
router.get('/:employeeId', verifyUser, async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { month, year } = req.query; // Optional filters

        if (req.user.role !== 'admin' && req.user._id.toString() !== employeeId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        let query = { employeeId };
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            query.date = { $gte: startDate, $lte: endDate };
        }

        const attendance = await Attendance.find(query).sort({ date: 1 });
        res.status(200).json({ success: true, attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ Mark Attendance (Admin only)
router.post('/mark', verifyUser, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { employeeId, date, status, shift, workHours } = req.body;

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOneAndUpdate(
            { employeeId, date: attendanceDate },
            { status, shift, workHours },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, message: "Attendance marked successfully", attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
