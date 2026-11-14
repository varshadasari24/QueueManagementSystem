import jwt from 'jsonwebtoken';

import Manager from '../models/Manager.js';

export const generateToken = (managerId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ id: managerId }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
};

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const manager = await Manager.findById(decoded.id).select('-password');

    if (!manager) {
      return res.status(401).json({ message: 'Manager not found' });
    }

    req.manager = manager;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
