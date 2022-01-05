const TelegramBot = require('node-telegram-bot-api');
const { BOT_TELEGRAM_TOKEN } = require('./constants');

const bot = new TelegramBot(BOT_TELEGRAM_TOKEN, { polling: true });

module.exports = bot;