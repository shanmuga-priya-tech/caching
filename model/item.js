const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    category: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
