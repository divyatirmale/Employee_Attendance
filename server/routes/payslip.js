import express from 'express';
import Payslip from '../models/Payslip.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Create Payslip (Admin only)
router.post('/add', verifyUser, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { employeeId, month, year, earnings, deductions } = req.body;

        const totalEarnings = Object.values(earnings).reduce((a, b) => a + (b || 0), 0);
        const totalDeductions = Object.values(deductions).reduce((a, b) => a + (b || 0), 0);
        const netPay = totalEarnings - totalDeductions;

        const newPayslip = new Payslip({
            employeeId,
            month,
            year,
            earnings,
            deductions,
            netPay
        });

        await newPayslip.save();
        res.status(201).json({ success: true, message: "Payslip created successfully", payslip: newPayslip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ Get Payslips for an Employee
router.get('/employee/:id', verifyUser, async (req, res) => {
    try {
        // Employees can only see their own payslips, admins can see any
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const payslips = await Payslip.find({ employeeId: req.params.id }).sort({ year: -1, month: -1 });
        res.status(200).json({ success: true, payslips });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ Get All Payslips (Admin only)
router.get('/', verifyUser, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const payslips = await Payslip.find().populate('employeeId', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, payslips });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
