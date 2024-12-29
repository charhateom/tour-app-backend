import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User registration
export const register = async (req, res) => {
    try {
        // Input validation
        const { username, email, password, photo } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hashing password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            email,
            password: hash,
            photo
        });

        await newUser.save();
        res.status(200).json({ success: true, message: 'Successfully created' });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create. Try again' });
    }
};

// User login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the password is correct
        const checkCorrectPassword = await bcrypt.compare(password, user.password);

        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

        const { password: _, role, ...rest } = user._doc;

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });

        // Set token in browser cookie with added security flags
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookie in production
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days expiration
        }).status(200).json({
            token,
            data: { ...rest },
            role
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to login. Try again' });
    }
};
