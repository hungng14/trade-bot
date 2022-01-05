const request = require('request');
const { COIN_GECKO_API } = require('./constants');
const bot = require('./my-bot');
const ChatIds = require('./models/chatId');
// const redis = require('./redis-config');
const listCommands = {
    comingpools: /\/comingpools/,
    today: /\/today/,
    exchanges: /\/exchanges/,
    markets: /\/markets/,
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

bot.onText(listCommands.comingpools, (msg, match) => {
    console.log('msg', msg)
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, JSON.stringify({ resp: 'here' }));
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