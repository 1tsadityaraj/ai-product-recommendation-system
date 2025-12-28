import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    unique: true,
    default: function() {
      return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
  },
  preferences: {
    preferredCategories: {
      type: Map,
      of: Number,
      default: {},
    },
    priceRange: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },
    preferredStores: {
      type: Map,
      of: Number,
      default: {},
    },
    averageBudget: { type: Number, default: null },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", function (next) {
  // Update updatedAt timestamp
  this.updatedAt = Date.now();
  
  // Only hash password if it's modified
  if (!this.isModified("password")) {
    return next();
  }
  
  // Hash the password using bcryptjs callbacks
  // Use self to preserve 'this' context in callbacks
  const self = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    
    bcrypt.hash(self.password, salt, (err, hash) => {
      if (err) return next(err);
      self.password = hash;
      next();
    });
  });
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;