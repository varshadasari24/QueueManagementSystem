import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'manager',
      enum: ['manager'],
    },
  },
  {
    timestamps: true,
  },
);

managerSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

managerSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

managerSchema.methods.toJSON = function toJSON() {
  const managerObject = this.toObject();
  delete managerObject.password;
  return managerObject;
};

export default mongoose.model('Manager', managerSchema);
