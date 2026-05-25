import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/user.js";
import bcrypt from "bcryptjs"; 
import connectDB from "./db/db.js";

const employeeRegister = async () => {
    await connectDB();

    try {
        const hashedPassword = await bcrypt.hash("employee123", 10);

        const newEmployee = new User({
            name: "Employee 1",
            email: "employee@gmail.com",
            password: hashedPassword,
            role: "employee" // Role is explicitly set to employee
        });

        await newEmployee.save();

        console.log("Employee user registered successfully");

        process.exit();
    } catch (error) {
        console.error("Error registering employee:", error);
        process.exit(1);
    }
};

employeeRegister();
