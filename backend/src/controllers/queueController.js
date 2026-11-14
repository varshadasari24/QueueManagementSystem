import Queue from '../models/Queue.js';

export const getManagerQueues = async (req, res) => {
  try {
    const queues = await Queue.find({ manager: req.manager._id }).sort({ createdAt: -1 });

    return res.status(200).json({ queues });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to fetch queues',
      error: error.message,
    });
  }
};

export const createQueue = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Queue name must be at least 2 characters long' });
    }

    const queue = await Queue.create({
      name: name.trim(),
      manager: req.manager._id,
    });

    return res.status(201).json({
      message: 'Queue created successfully',
      queue,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Queue creation failed',
      error: error.message,
    });
  }
};

export const getQueueById = async (req, res) => {
  try {
    const queue = await Queue.findOne({
      _id: req.params.id,
      manager: req.manager._id,
    });

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    return res.status(200).json({ queue });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to load queue',
      error: error.message,
    });
  }
};

export const addTokenToQueue = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    const queue = await Queue.findOne({ _id: id, manager: req.manager._id });

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    const nextNumber = queue.tokens.length > 0 ? Math.max(...queue.tokens.map((token) => token.number)) + 1 : 1;

    queue.tokens.push({
      name: name.trim(),
      number: nextNumber,
      status: 'waiting',
    });

    await queue.save();
    const newToken = queue.tokens[queue.tokens.length - 1];

    return res.status(201).json({
      message: 'Token added successfully',
      token: newToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to add token',
      error: error.message,
    });
  }
};

export const moveTokenInQueue = async (req, res) => {
  try {
    const { id, tokenId } = req.params;
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ message: 'Move direction must be up or down' });
    }

    const queue = await Queue.findOne({ _id: id, manager: req.manager._id });

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    const index = queue.tokens.findIndex((token) => token._id.toString() === tokenId);

    if (index === -1) {
      return res.status(404).json({ message: 'Token not found' });
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= queue.tokens.length) {
      return res.status(400).json({ message: 'Token cannot move beyond the queue bounds' });
    }

    [queue.tokens[index], queue.tokens[targetIndex]] = [queue.tokens[targetIndex], queue.tokens[index]];
    await queue.save();

    return res.status(200).json({
      message: 'Token order updated',
      queue,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to move token',
      error: error.message,
    });
  }
};

export const serveToken = async (req, res) => {
  try {
    const { id, tokenId } = req.params;

    const queue = await Queue.findOne({ _id: id, manager: req.manager._id });

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    const token = queue.tokens.find((item) => item._id.toString() === tokenId);

    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    const firstWaiting = queue.tokens.find((item) => item.status === 'waiting');

    if (firstWaiting && firstWaiting._id.toString() !== tokenId) {
      return res.status(400).json({ message: 'Only the first waiting token can be assigned for service' });
    }

    token.status = 'serving';
    await queue.save();

    return res.status(200).json({
      message: 'Token assigned for service',
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to assign service',
      error: error.message,
    });
  }
};

export const cancelToken = async (req, res) => {
  try {
    const { id, tokenId } = req.params;

    const queue = await Queue.findOne({ _id: id, manager: req.manager._id });

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    const beforeCount = queue.tokens.length;
    queue.tokens = queue.tokens.filter((token) => token._id.toString() !== tokenId);

    if (queue.tokens.length === beforeCount) {
      return res.status(404).json({ message: 'Token not found' });
    }

    await queue.save();

    return res.status(200).json({
      message: 'Token cancelled and removed from the queue',
      queue,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to cancel token',
      error: error.message,
    });
  }
};
