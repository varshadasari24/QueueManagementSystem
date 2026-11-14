import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'serving', 'completed', 'cancelled'],
      default: 'waiting',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
      required: true,
      index: true,
    },
    tokens: [tokenSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Queue', queueSchema);
