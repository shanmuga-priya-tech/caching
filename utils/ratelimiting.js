const ratestorage = new Map();
const max_req = 20;
const time_limit = 60 * 1000; //1 min

exports.rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const current_time = Date.now();

  if (!ratestorage.has(ip)) {
    ratestorage.set(ip, { count: 1, startTime: current_time });
  } else {
    const current_req = ratestorage.get(ip);

    if (current_time - current_req.startTime > time_limit) {
      ratestorage.delete(ip);
      ratestorage.set(ip, { count: 1, startTime: current_time });
    } else {
      current_req.count++;

      if (current_req.count > max_req) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      }

      //updating with the increased count
      ratestorage.set(ip, current_req);
    }
  }
  next();
};

// Remove expired entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, current_req] of ratestorage) {
    if (now - current_req.startTime > time_limit) {
      ratestorage.delete(ip);
    }
  }
}, time_limit);
