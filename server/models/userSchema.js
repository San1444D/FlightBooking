import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ['admin', 'customer', 'operator'],
        default: 'customer',
    },
    approval: {
        type: String,
        enum: ['approved', 'not-approved', 'rejected'],
        default: 'approved',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    updateBy: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, versionKey: false,
});

userSchema.index({ email: 1, isDeleted: -1 }); // Compound index for efficient queries
const User = model("User", userSchema);

export default User;