
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        required: true  
    },
    ProfileImage: {
        type: String
    },
    permissions: {
        type: [String],
        default: []
    },
    nickname: { type: String, default: "" },
    birthday: { type: String, default: "" },
    location: { type: String, default: "" },
    designation: { type: String, default: "" },
    department: { type: String, default: "" },
    timezone: { type: String, default: "" },
    biography: { type: String, default: "" },
    socialMedia: { type: String, default: "" },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }   
}); 

const User = mongoose.model('User', userSchema);

export default User;
