const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  permissions: {
    webStart: {
      stats: {
        type: Boolean,
        default: false,
      },
      users: {
        type: Boolean,
        default: false,
      },
      permissions: {
        type: Boolean,
        default: false,
      },
      bugs: {
        type: Boolean,
        default: false,
      },
    },
    npcs: {
      login: {
        type: Boolean,
        default: false,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    },
    lies: {
      login: {
        type: Boolean,
        default: false,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    },
    villages: {
      login: {
        type: Boolean,
        default: false,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    },
    quests: {
      login: {
        type: Boolean,
        default: false,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    },
    carLi: {
      login: {
        type: Boolean,
        default: false,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    },
    cookBook: {
      login: {
        type: Boolean,
        default: false,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = User = mongoose.model("users", UserSchema);