const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permission: { type: [String], default: [] }
});

module.exports = mongoose.model('Permission', PermissionSchema);