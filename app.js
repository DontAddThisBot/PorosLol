
require("dotenv").config();

// Imports
const express = require('express')
var session        = require('express-session');
var passport       = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request        = require('request');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET    = process.env.TWITCH_SECRET;
const SESSION_SECRET   = process.env.SESSION_SECRET;
const CALLBACK_URL     = process.env.CALLBACK_URL;

global.bot = {};
bot.Redis = require("./util/redis.js");
bot.DB = require("./util/db.js");
require("./api/server");
const humanizeDuration = require('./humanizeDuration');
const axios = require('axios');

const app = express()
const port = 3001

// Static Files
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use(passport.initialize());
app.use(passport.session());
app.set('views', './views')
app.set('view engine', 'ejs')

OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
    var options = {
      url: 'https://api.twitch.tv/helix/users',
      method: 'GET',
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': 'Bearer ' + accessToken
      }
    };
  
    request(options, function (error, response, body) {
      if (response && response.statusCode == 200) {
        done(null, JSON.parse(body));
        console.log(JSON.parse(body))
      } else {
        done(JSON.parse(body));
      }
    });
  }

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    // Securely store user profile in your DB
    //User.findOrCreate(..., function(err, user) {
    //  done(err, user);
    //});

    done(null, profile);
  }
));

// Set route to start OAuth link, this is where you define scopes to request
app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));

// Set route for OAuth redirect
app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));


app.get('', async (req, res) => {
    const channels = await bot.DB.channels.find({}).exec()
    if(req.session && req.session.passport && req.session.passport.user) {
        const user = req.session.passport.user;
        const levelRank = await bot.DB.users.findOne({ username: user.data[0].login }).exec()
          res.render('success', {
            username: user.data[0].display_name,
            avatar: user.data[0].profile_image_url,
            bio: user.data[0].description,
            channels: channels.length.toLocaleString(),
            rank: levelRank.level,
          });
      } else {
        res.render('index', {
            channels: channels.length.toLocaleString(),
        })
      }

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

app.get('/privacy', (req, res) => {
    res.render('privacy')
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
        const myRank = (((poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)).slice(0, 5000000)).findIndex((user) => user.username == req.query.user.toLowerCase()) + 1)
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