const Cache = require("../model/cache");

exports.getCache = async (key) => {
  const cache = await Cache.findOneAndUpdate(
    { key },
    { lastAccessed: Date.now() },
    { new: true }
  );
  return cache ? cache.data : null;
};

exports.setCache = async (key, data) => {
  const CACHE_MAX_LIMIT = 2;
  const totalDocs = await Cache.countDocuments();

  if (totalDocs >= CACHE_MAX_LIMIT) {
    //deleting the least accessed one
    await Cache.findOneAndDelete({}, { sort: { lastAccessed: 1 } });
  }

  await Cache.findOneAndUpdate(
    { key },
    { data, lastAccessed: Date.now() },
    { new: true, upsert: true }
  );
};
