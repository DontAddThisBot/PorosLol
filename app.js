

// Imports
const express = require('express')

global.bot = {};
bot.Redis = require("./util/redis.js");
bot.DB = require("./util/db.js");
require("./api/server");

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
    res.render('index', { text: "xd" })

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
        res.render('leaderboard', { porosLB1: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(0, 1)).map((user) => `${user.username} - ${user.poroCount} `) 
        , porosLB2: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(1, 2)).map((user) => `${user.username} - ${user.poroCount} `),
        porosLB3: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(2, 3)).map((user) => `${user.username} - ${user.poroCount} `),
        porosLB4: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(3, 4)).map((user) => `${user.username} - ${user.poroCount} `),
        porosLB5: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(4, 5)).map((user) => `${user.username} - ${user.poroCount} `),
        porosLB6: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(5, 6)).map((user) => `${user.username} - ${user.poroCount} `),
        porosLB7: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(6, 7)).map((user) => `${user.username} - ${user.poroCount} `),
        porosLB8: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(7, 8)).map((user) => `${user.username} - ${user.poroCount} `),
        porosLB9: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(8, 9)).map((user) => `${user.username} - ${user.poroCount} `),
        porosLB10: ((kekw.sort((a, b) => b.poroCount - a.poroCount)).slice(9, 10)).map((user) => `${user.username} - ${user.poroCount} `),

    })
    })
})

app.get('/channel', (req, res) => {
    bot.DB.poroCount.findOne({ username: req.query.user.toLowerCase() }).exec(function(err, kekw2) {
        if (!kekw2) {
           return res.status(404).send("User not found");
        }
        if (err) throw err;
        res.render('channel', {
            xd: kekw2,
        })
    })
})

app.get('/rank', (req, res) => {
    bot.DB.poroCount.find({}).exec(function(err, kekw3) {
        if (err) throw err;
        res.render('rank', {
            xd2: (((kekw3.sort((a, b) => b.poroCount - a.poroCount)).slice(0, 5000000)).findIndex((user) => user.username == req.query.user) + 1),
            xd3: (kekw3.length.toLocaleString())
        })
    })
})





// Listen on port 3001
app.listen(port, () => console.info(`Listening on port ${port}`))