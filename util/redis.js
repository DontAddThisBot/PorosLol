const Redis = require("ioredis");
const redis = new Redis({});

module.exports = redis;

redis.on("error", (err) => {
  console.log(`Redis Error: ${err}`);
});

redis.on("ready", () => {
  console.log("Redis Connected");
});
