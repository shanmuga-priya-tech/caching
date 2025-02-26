const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Item = require("./model/item");
const { getCache, setCache } = require("./utils/cacheHelper");
const Cache = require("./model/cache");
dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`⏳ ${req.method} ${req.originalUrl} - ${duration}ms`);
  });
  next();
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB connection successfull!"));

//fn to get data
app.get("/items/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const key = `item_${category}`;

    //getting from cache
    const chacheddata = await getCache(key);
    if (chacheddata) {
      return res.status(200).json(chacheddata);
    }
    const query = category === "all" ? {} : { category: category };
    //if no get from cache
    const items = await Item.find(query);

    await setCache(key, items);

    res.status(200).json(items);
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});

app.post("/item", async (req, res) => {
  try {
    if (!req.body.category) {
      return res.status(400).json({ error: "Name & Category are required" });
    }
    const newItem = await Item.create(req.body);

    //once the item is added we need to clear cache to provideupdated res
    await Cache.deleteOne({ key: `item_${req.body.category}` });

    res.status(201).json(newItem);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

app.listen(3000, () => {
  console.log("app running on port 3000");
});
