const mongoose = require("mongoose");

const cacheSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  data: Object,
  lastAccessed: { type: Date, default: Date.now },
});

const Cache = mongoose.model("Cache", cacheSchema);
module.exports = Cache;
