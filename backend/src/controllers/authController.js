import Manager from '../models/Manager.js';
import { generateToken } from '../middleware/authMiddleware.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeManager = (manager) => ({
  id: manager._id,
  name: manager.name,
  email: manager.email,
  role: manager.role,
  createdAt: manager.createdAt,
});

export const registerManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingManager = await Manager.findOne({ email: normalizedEmail });

    if (existingManager) {
      return res.status(409).json({ message: 'A manager with this email already exists' });
    }

    const manager = await Manager.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(manager._id);

    return res.status(201).json({
      message: 'Manager registered successfully',
      token,
      manager: sanitizeManager(manager),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Manager registration failed',
      error: error.message,
    });
  }
};

export const loginManager = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const manager = await Manager.findOne({ email: normalizedEmail }).select('+password');

    if (!manager) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await manager.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(manager._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      manager: sanitizeManager(manager),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};
