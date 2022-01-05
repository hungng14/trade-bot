const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    projectName: 'string',
    price: 'number',
    startJoinPoolTime: 'number',
    endJoinPoolTime: 'number',
    startBuyTime: 'number',
    endBuyTime: 'number',
    claimTime: 'number',

});
const Pools = mongoose.model('Pools', schema);
module.exports = Pools;