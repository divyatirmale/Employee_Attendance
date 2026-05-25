import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/user.js";
import bcrypt from "bcryptjs";
import connectDB from "./db/db.js";

const userRegister = async () => {
    await connectDB();

    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin"
        });

        await newUser.save();

        console.log("User registered successfully");

        process.exit(); // ✅ script band ho jayega
    } catch (error) {
        console.error("Error registering user:", error);
        process.exit(1);
    }
};

// ✅ YE SABSE IMPORTANT
userRegister();