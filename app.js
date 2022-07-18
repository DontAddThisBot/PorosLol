

// Imports
const express = require('express')

global.bot = {};
bot.Redis = require("./util/redis.js");
bot.DB = require("./util/db.js");
require("./api/server");
const humanizeDuration = require('./humanizeDuration');
const axios = require('axios');

const app = express()
const port = 3001





// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views

app.set('views', './views')
app.set('view engine', 'ejs')


app.get('', (req, res) => {
    bot.DB.channels.find({}).exec(function(err, channels) {
        if (err) throw err;
        res.render('index', {
            channelcount: (channels.length.toLocaleString())
        })
    })

})

app.get('/commands', (req, res) => {
    res.render('commands', { text: 'Commands' })
})

app.get('/search', (req, res) => {
    res.render('search')
})

app.get('/code', (req, res) => {
    res.render('code')
})

app.get('/leaderboard', (req, res) => {
    bot.DB.poroCount.find({}).exec(function(err, kekw) {
        if (err) throw err;
        res.render('leaderboard', { porosLB1: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(0, 1)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `) 
        , porosLB2: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(1, 2)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `),
        porosLB3: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(2, 3)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `),
        porosLB4: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(3, 4)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `),
        porosLB5: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(4, 5)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `),
        porosLB6: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(5, 6)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `),
        porosLB7: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(6, 7)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `),
        porosLB8: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(7, 8)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `),
        porosLB9: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(8, 9)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `),
        porosLB10: ((kekw.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(9, 10)).map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount} `),

    })
    })
})

app.get('/channel', async (req, res) => {
        const kekw2 = await bot.DB.poroCount.findOne({ username: req.query.user.toLowerCase() }).exec()
        if (!kekw2) {
            return res.render('error')
        }
        var today = new Date();
        const timestamp = new Date(kekw2.joinedAt)
        const diffTime = Math.abs(today - timestamp);
        const registerDate = humanizeDuration(diffTime);
        const api = await axios.get(`https://api.ivr.fi/twitch/resolve/${req.query.user.toLowerCase()}`)
        const poroData = await bot.DB.poroCount.find({}).exec();
        const myRank = (((poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(0, 5000000)).findIndex((user) => user.username == req.query.user) + 1)
        res.render('channel', {
            xd: kekw2,
            register: registerDate,
            api: api.data,
            myPoroRank: myRank,
            AllPoroRank: (poroData.length.toLocaleString())
        })
})




// Listen on port 3001
app.listen(port, () => console.info(`Listening on port ${port}`))