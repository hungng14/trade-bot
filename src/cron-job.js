const CronJob = require('cron').CronJob;
const request = require('request');
const bot = require('./my-bot');
const redis = require('./redis-config');

const COIN_GECKO_API = process.env.COIN_GECKO_API;

const job = new CronJob('1 0 7 * * *', async function() {

    const lastchatid = await redis.get('last-chat-id')
    if (lastchatid) {
        request(`${COIN_GECKO_API}/ping`, (err, res, body) => {
            bot.sendMessage(lastchatid, JSON.stringify(body));
        })
    }
}, null, true, 'Asia/Ho_Chi_Minh');
job.start();