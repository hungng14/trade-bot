const CronJob = require('cron').CronJob;
const request = require('request');
const bot = require('./my-bot');
// const redis = require('./redis-config');
const ChatIds = require('./models/chatId');
const PoolsModel = require('./models/pools');


const COIN_GECKO_API = process.env.COIN_GECKO_API;

const sendMessage = async(pools = [], timeType = '') => {
    if (pools.length) {
        const lastChatId = await ChatIds.findOne();
        if (!lastChatId) return;
        const msg = pools.reduce((str, item) => {
            if (timeType === 'joinTime') {
                str += `Project Name: ${item.projectName}, Start Join Pool Time: ${new Date(item.startJoinPoolTime).toLocaleString()}, End Join Pool Time: ${new Date(item.endJoinPoolTime).toLocaleString()}\n`;
            } else if (timeType === 'buyTime') {
                str += `Project Name: ${item.projectName}, Start Buy Pool Time: ${new Date(item.startBuyTime).toLocaleString()}, End Buy Pool Time: ${new Date(item.endBuyTime).toLocaleString()}\n`;
            } else if (timeType === 'claimTime') {
                str += `Project Name: ${item.projectName}, Claim Pool Time: ${new Date(item.claimTime).toLocaleString()}\n`;
            }
            return str;
        }, '');
        bot.sendMessage(lastChatId.chatId, msg);
    }
}

const job = new CronJob('1 0 7 * * *', async function() {

    // const lastchatid = await redis.get('last-chat-id')
    const lastChatId = await ChatIds.findOne();
    if (lastChatId) {
        request(`${COIN_GECKO_API}/ping`, (err, res, body) => {
            bot.sendMessage(lastChatId.chatId, JSON.stringify(body));
        })
    }
}, null, true, 'Asia/Ho_Chi_Minh');
job.start();

const notiComingPoolsJob = new CronJob('1 * * * * *', async() => {
        const timeNow = Date.now();
        const pools = await PoolsModel.find({
            endJoinPoolTime: { $gt: timeNow },
        });
        sendMessage(pools, 'joinTime');
    }, null, true, 'Asia/Ho_Chi_Minh')
    // notiComingPoolsJob.start();

const notiComingBuyPoolsJob = new CronJob('1 * * * * *', async() => {
        const timeNow = Date.now();
        const pools = await PoolsModel.find({
            $and: [
                { endJoinPoolTime: { $lt: timeNow }, },
                { endBuyTime: { $gt: timeNow }, },
            ]
        });
        sendMessage(pools, 'buyTime');
    }, null, true, 'Asia/Ho_Chi_Minh')
    // notiComingBuyPoolsJob.start();

const notiComingClaimPoolsJob = new CronJob('1 * * * * *', async() => {
        const timeNow = Date.now();
        const pools = await PoolsModel.find({
            $and: [
                { claimTime: { $gt: timeNow }, },
                { endBuyTime: { $lt: timeNow }, },
            ]
        });
        sendMessage(pools, 'claimTime');
    }, null, true, 'Asia/Ho_Chi_Minh')
    // notiComingClaimPoolsJob.start();