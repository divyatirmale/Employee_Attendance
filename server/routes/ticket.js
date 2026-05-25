import express from "express";
import Ticket from "../models/Ticket.js";
import verifyUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new ticket
router.post("/add", verifyUser, async (req, res) => {
    try {
        const { category, subject, description, priority } = req.body;
        const newTicket = new Ticket({
            employeeId: req.user._id,
            category,
            subject,
            description,
            priority
        });
        await newTicket.save();
        res.status(201).json({ success: true, message: "Ticket created successfully! ✅" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get tickets (for employee or admin)
router.get("/", verifyUser, async (req, res) => {
    try {
        let tickets;
        if (req.user.role === 'admin') {
            tickets = await Ticket.find().populate('employeeId', 'name email');
        } else {
            tickets = await Ticket.find({ employeeId: req.user._id });
        }
        res.status(200).json({ success: true, tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update ticket status (Admin or Employee)
router.put("/:id", verifyUser, async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { 
            status, 
            updatedAt: Date.now() 
        }, { new: true });
        res.status(200).json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete ticket
router.delete("/:id", verifyUser, async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Ticket deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
