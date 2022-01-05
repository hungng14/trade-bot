require('dotenv').config();
const express = require('express');
const request = require('request');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://shone:shone@cluster0.whdxi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then((res) => {
        console.log('ConnectDatabase success')
    }).catch(err => {
        console.error("Error connect database")
    })

const app = express();
require('./bot-listener');
require('./cron-job');

const BOT_TELEGRAM_ENDPOINT = process.env.BOT_TELEGRAM_ENDPOINT;
const BOT_TELEGRAM_TOKEN = process.env.BOT_TELEGRAM_TOKEN;

app.get('/about-me', async(req, res) => {
    request.get(`${BOT_TELEGRAM_ENDPOINT}/bot${BOT_TELEGRAM_TOKEN}/getme`, (err, response, body) => {
        res.json({ aboutMe: JSON.parse(body) })
    });
})

const port = process.env.PORT || 3004;
app.listen(port, () => console.log(`Server is running at port ${port}`));