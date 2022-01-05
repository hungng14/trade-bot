require('dotenv').config();
const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const PoolsModel = require('./models/pools');

mongoose.connect('mongodb+srv://shone:shone@cluster0.whdxi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then((res) => {
        console.log('ConnectDatabase success')
    }).catch(err => {
        console.error("Error connect database")
    })

const app = express();
require('./bot-listener');
require('./cron-job');

app.use(express.json())

const BOT_TELEGRAM_ENDPOINT = process.env.BOT_TELEGRAM_ENDPOINT;
const BOT_TELEGRAM_TOKEN = process.env.BOT_TELEGRAM_TOKEN;

app.get('/about-me', async(req, res) => {
    request.get(`${BOT_TELEGRAM_ENDPOINT}/bot${BOT_TELEGRAM_TOKEN}/getme`, (err, response, body) => {
        res.json({ aboutMe: JSON.parse(body) })
    });
})

app.post('/pool/create', async(req, res) => {
    const body = req.body;
    const data = {
        projectName: body.projectName,
        price: body.price,
        startJoinPoolTime: body.startJoinPoolTime,
        endJoinPoolTime: body.endJoinPoolTime,
        startBuyTime: body.startBuyTime,
        endBuyTime: body.endBuyTime,
        claimTime: body.claimTime,
    }
    const result = await PoolsModel.create(data);
    console.log('result', result)
    if (!result) {
        return res.status(500).json({ message: 'Some thing went wrong' })
    }
    return res.status(200).json({ success: true })
})

app.get('/pools', async(req, res) => {
    const pools = await PoolsModel.find();
    return res.json({
        data: pools,
    })
})

const port = process.env.PORT || 3004;
app.listen(port, () => console.log(`Server is running at port ${port}`));