const mongoose = require('mongoose');
const schema = new mongoose.Schema({ chatId: 'string' });
const ChatIds = mongoose.model('ChatIds', schema);
module.exports = ChatIds;