const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient({
    url: process.env.REDIS_URL,
});
client.get = promisify(client.get);

module.exports = client;