const Cache = require("../model/cache");

exports.getCache = async (key) => {
  const data = await Cache.findOne({ key });
  if (data) {
    // console.log(`${key}: ${data}`);
    return data;
  }
  return null;
};

exports.setCache = async (key, data) => {
  await Cache.findOneAndUpdate({ key }, { data }, { new: true, upsert: true });
};
