import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// 1. LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials ❌" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
        ProfileImage: user.ProfileImage
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login Failed ❌" });
  }
};

// 2. VERIFY TOKEN (FOR AUTO LOGIN ON REFRESH)
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Return user details
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
        ProfileImage: user.ProfileImage
      }
    });

  } catch (error) {
    console.error("Verify Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// 3. REGISTER EMPLOYEE (ADMIN ONLY)
const registerEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new employee
    const newEmployee = new User({
      name,
      email,
      password: hashedPassword,
      role: "employee" // Forced to employee role
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: "Employee registered successfully ✅",
      user: {
        id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// 4. GET ALL EMPLOYEES (ADMIN ONLY)
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Get Employees Error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching employees" });
  }
};

// 5. REGISTER ADMIN (ADMIN ONLY)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      permissions: permissions || []
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully ✅",
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        permissions: newAdmin.permissions
      }
    });

  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// 6. GET ALL ADMINS (ADMIN ONLY)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error("Get Admins Error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching admins" });
  }
};

// 7. UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
        nickname: user.nickname,
        birthday: user.birthday,
        location: user.location,
        designation: user.designation,
        department: user.department,
        timezone: user.timezone,
        biography: user.biography,
        socialMedia: user.socialMedia,
        ProfileImage: user.ProfileImage
      }
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error while updating profile" });
  }
};

export { login, verifyToken, registerEmployee, getAllEmployees, registerAdmin, getAllAdmins, updateProfile };