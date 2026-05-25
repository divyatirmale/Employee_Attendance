import express from "express";
import Task from "../models/Task.js";
import verifyUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a task
router.post("/", verifyUser, async (req, res) => {
    try {
        const { title, description, assignedTo, priority, dueDate } = req.body;
        
        // Clean up data
        const taskData = {
            title,
            description,
            assignedTo: assignedTo && assignedTo !== "" ? assignedTo : req.user._id,
            createdBy: req.user._id,
            priority,
            dueDate: dueDate && dueDate !== "" ? dueDate : undefined
        };

        const newTask = new Task(taskData);
        await newTask.save();
        const populatedTask = await Task.findById(newTask._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        res.status(201).json({ success: true, task: populatedTask });
    } catch (error) {
        console.error("Task POST Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get tasks
router.get("/", verifyUser, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name email');
        } else {
            tasks = await Task.find({ 
                $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] 
            }).populate('assignedTo', 'name email').populate('createdBy', 'name email');
        }
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update task status
router.put("/:id", verifyUser, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a task
router.delete("/:id", verifyUser, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
