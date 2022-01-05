const request = require('request');
const { COIN_GECKO_API } = require('./constants');
const bot = require('./my-bot');
const ChatIds = require('./models/chatId');
const PoolsModel = require('./models/pools');

// const redis = require('./redis-config');
const listCommands = {
    comingjoin: /\/comingjoin/,
    comingbuy: /\/comingbuy/,
    comingclaim: /\/comingclaim/,
    today: /\/today/,
    exchanges: /\/exchanges/,
    markets: /\/markets/,
}

const sendMessage = async(pools = [], timeType = '', chatId) => {
    if (pools.length) {
        if (!chatId) return;
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
        bot.sendMessage(chatId, msg);
    } else {
        bot.sendMessage(chatId, 'There no pools avaiable');
    }
}

bot.on('message', async(msg) => {
    try {
        // console.log(msg);
        await ChatIds.findOneAndUpdate({}, { chatId: msg.chat.id }, { upsert: true })
        console.log('Save chatid success')
            // bot.sendMessage(msg.chat.id, "Hello")
            // redis.set('last-chat-id', msg.chat.id);
    } catch (error) {
        console.log('Error when save chat id', error.message);
    }

})

bot.onText(listCommands.comingjoin, async(msg, match) => {
    const chatId = msg.chat.id;
    const timeNow = Date.now();
    const pools = await PoolsModel.find({
        endJoinPoolTime: { $gt: timeNow },
    });
    sendMessage(pools, 'joinTime', chatId);
});

bot.onText(listCommands.comingbuy, async(msg, match) => {
    const chatId = msg.chat.id;

    const timeNow = Date.now();
    const pools = await PoolsModel.find({
        $and: [
            { endJoinPoolTime: { $lt: timeNow }, },
            { endBuyTime: { $gt: timeNow }, },
        ]
    });
    sendMessage(pools, 'buyTime', chatId);
});

bot.onText(listCommands.comingclaim, async(msg, match) => {
    const chatId = msg.chat.id;
    const timeNow = Date.now();
    const pools = await PoolsModel.find({
        $and: [
            { endBuyTime: { $lt: timeNow }, },
        ]
    });
    sendMessage(pools, 'claimTime', chatId);
});

bot.onText(listCommands.today, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, new Date().toLocaleString());
});

bot.onText(listCommands.exchanges, async(msg) => {
    const chatId = msg.chat.id;
    request(`${COIN_GECKO_API}/exchanges?per_page=20&page=1`, (err, res, body) => {
        const arr = JSON.parse(body);
        const msg = arr.reduce((str, item) => {
            str += `id: ${item.id}, name: ${item.name}, country: ${item.country}\n`;
            return str;
        }, '');
        bot.sendMessage(chatId, msg);
    })
});

bot.onText(listCommands.markets, async(msg) => {
    const chatId = msg.chat.id;
    request(`${COIN_GECKO_API}/coins/markets?vs_currency=usd&per_page=20&page=1`, (err, res, body) => {
        const arr = JSON.parse(body);
        const msg = arr.reduce((str, item) => {
            str += `symbol: ${item.symbol}, name: ${item.name}, current_price: ${item.current_price}, high_24h: ${item.high_24h}, low_24h: ${item.low_24h}\n`;
            return str;
        }, '');
        bot.sendMessage(chatId, msg);
    })

});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    let commands = Object.keys(listCommands).reduce((str, k) => {
        str += '/' + k + '\n';
        return str;
    }, '');
    commands = 'List Commands Allowed\n' + commands;
    bot.sendMessage(chatId, commands);
});