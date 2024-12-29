import User from '../models/User.js';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

// create new User
export const createUser = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid input data', errors: errors.array() });
    }

    const newUser = new User(req.body);

    try {
        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User successfully created',
            data: savedUser,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: `Failed to create. Error: ${err.message}` });
    }
};

// update User
export const updateUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User successfully updated',
            data: updatedUser,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: `Failed to update. Error: ${err.message}` });
    }
};

// delete User
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User successfully deleted',
        });
    } catch (err) {
        res.status(500).json({ success: false, message: `Failed to delete. Error: ${err.message}` });
    }
};

// get single User
export const getSingleUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User found',
            data: user,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: `Failed to retrieve user. Error: ${err.message}` });
    }
};

// get all Users
export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            message: 'Users successfully retrieved',
            data: users,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to retrieve users. Error: ${err.message}`,
        });
    }
};
