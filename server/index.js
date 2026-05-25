import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';    
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';
import leaveRoutes from './routes/leave.js';
import ticketRoutes from './routes/ticket.js';
import payslipRoutes from './routes/payslip.js';
import employeeInfoRoutes from './routes/employeeInfo.js';
import attendanceRoutes from './routes/attendance.js';
import documentRoutes from './routes/document.js';
import postRoutes from './routes/post.js';
import connectDB from "./db/db.js"; // ✅ add

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('public'));

// Request logger for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ✅ connect DB
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payslips', payslipRoutes);
app.use('/api/employee-info', employeeInfoRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/posts', postRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});