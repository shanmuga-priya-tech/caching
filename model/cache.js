const mongoose = require("mongoose");

const cacheSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    data: Object,
  },
  {
    timestamps: true,
  }
);

const Cache = mongoose.model("Cache", cacheSchema);
module.exports = Cache;
