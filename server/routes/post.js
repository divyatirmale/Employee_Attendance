import express from 'express';
import Post from '../models/Post.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// MULTER CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/posts';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all posts
router.get('/', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a post with optional image
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const post = new Post({
            author: req.user._id,
            authorName: req.user.name,
            title: req.body.title,
            group: req.body.group || 'General',
            image: req.file ? `/uploads/posts/${req.file.filename}` : null
        });

        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Reaction to a post
router.post('/:id/react', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const { reaction } = req.body;
        if (!post.reactions.includes(reaction)) {
            post.reactions.push(reaction);
            post.reactor = `${req.user.name} reacted...`;
            await post.save();
        }
        res.json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add a comment
router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = {
            user: req.user._id,
            userName: req.user.name,
            text: req.body.text
        };

        post.comments.push(comment);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
