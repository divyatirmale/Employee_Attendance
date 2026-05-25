import express from 'express';
import Document from '../models/Document.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get Documents for an Employee (Employee or Admin)
router.get('/:employeeId', verifyUser, async (req, res) => {
    try {
        const { employeeId } = req.params;
        
        if (req.user.role !== 'admin' && req.user._id.toString() !== employeeId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const documents = await Document.find({ employeeId }).sort({ uploadedAt: -1 });
        res.status(200).json({ success: true, documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ Upload Document (Admin only)
router.post('/upload', verifyUser, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { employeeId, category, name, fileUrl } = req.body;

        const newDoc = new Document({
            employeeId,
            category,
            name,
            fileUrl
        });

        await newDoc.save();
        res.status(201).json({ success: true, message: "Document uploaded successfully", document: newDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ Delete Document (Admin only)
router.delete('/:id', verifyUser, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Document.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Document deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
