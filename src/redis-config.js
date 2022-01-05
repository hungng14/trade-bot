const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient();
client.get = promisify(client.get);

module.exports = client;