require("dotenv").config();

// Imports
const express = require("express");
var session = require("express-session");
var passport = require("passport");
var OAuth2Strategy = require("passport-oauth").OAuth2Strategy;
var request = require("request");

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

global.bot = {};
bot.Redis = require("./util/redis.js");
bot.DB = require("./util/db.js");
const humanizeDuration = require("./humanizeDuration");
const axios = require("axios");
const nodeFetch = require("node-fetch");
const join = require('./routes/join')
const part = require('./routes/part')
const ban = require('./routes/ban')
const unban = require('./routes/unban')
const poro = require('./routes/poros')
const offline = require('./routes/offline')

const app = express();
const port = 3001;

// Static Files
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(express.static("public"));
app.use(passport.session());
app.use(passport.initialize());
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
app.use(join)
app.use(part)
app.use(ban)
app.use(unban)
app.use(poro)
app.use(offline)
app.set("views", "./views");
app.set("view engine", "ejs");

OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
  var options = {
    url: "https://api.twitch.tv/helix/users",
    method: "GET",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      Accept: "application/vnd.twitchtv.v5+json",
      Authorization: "Bearer " + accessToken,
    },
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
      console.log(JSON.parse(body))
    }
  });
};

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  "twitch",
  new OAuth2Strategy(
    {
      authorizationURL: "https://id.twitch.tv/oauth2/authorize",
      tokenURL: "https://id.twitch.tv/oauth2/token",
      clientID: TWITCH_CLIENT_ID,
      clientSecret: TWITCH_SECRET,
      callbackURL: CALLBACK_URL,
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;

      // Securely store user profile in your DB
      //User.findOrCreate(..., function(err, user) {
      //  done(err, user);
      //});

      done(null, profile);
      console.log(profile);
    }
  )
);

// Set route to start OAuth link, this is where you define scopes to request
app.get("/auth/twitch", passport.authenticate("twitch", { scope: "" }));

// Set route for OAuth redirect
app.get(
  "/auth/twitch/callback",
  passport.authenticate("twitch", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("", async (req, res) => {
  const data = await nodeFetch(`http://localhost:3003/api/bot/channels`, {
        method: "GET",
    });
  const channels = await data.json()
  if (req.session && req.session.passport && req.session.passport.user) {
    //console.log(req.session.passport.user.data[0])
    const {id, login, profile_image_url} = req.session.passport.user.data[0];
    const data = await nodeFetch(`http://localhost:3003/api/bot/users/${login}`, {
        method: "GET",
    });
    const levelRank = await data.json()
    //console.log(levelRank)
    if (!levelRank.success) {
      const userdata = new bot.DB.users({
        id: id,
        username: login,
        firstSeen: new Date(),
        prefix: "|",
        level: 1,
      });
      await userdata.save();
      res.render("index", {
        // if login success but not in database user must retry.
        channels: channels.channelCount.toLocaleString(),
        allPoros: channels.totalPoros
      });
    } else {
      const data = await nodeFetch(`http://localhost:3003/api/bot/channel/${login}`, {
              method: "GET",
      });
      const b = await data.json()
      //console.log(b)
      if (!b.success) {
        // If user doesnt have the bot added, reply with false.
        res.render('success', {
          username: login,
          rank: levelRank.level,
          channels: channels.channelCount.toLocaleString(),
          allPoros: channels.totalPoros,
          avatar: profile_image_url,
          inChannel: false,
        });
      } else {
        // If user has the bot added, reply with true.
        res.render('success', {
          username: login,
          rank: levelRank.level,
          channels: channels.channelCount.toLocaleString(),
          allPoros: channels.totalPoros,
          avatar: profile_image_url,
          inChannel: true,
        })
      }
    }
  } else {
    res.render("index", {
      // If login failed, then idk?
      channels: channels.channelCount.toLocaleString(),
      allPoros: channels.totalPoros,
    });
  };
});

app.get("/admin", async (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    const {login} = req.session.passport.user.data[0];
    const data = await nodeFetch(`http://localhost:3003/api/bot/users/${login}`, {
        method: "GET",
    });
    const levelRank = await data.json()
    if (levelRank.level > 1) {
      // If user is above level 1, render admin page.
      res.render("admin", {
        rank: levelRank.level,
      });
    } else {
      // If user is below level 1, render denied page.
      res.redirect("/denied");
    }
  } else {
    // If user is not logged in, render homepage.
    res.redirect("/");
  }
});

app.get("/commands", (req, res) => {
  res.render("commands", { text: "Commands" });
});

app.get("/search", (req, res) => {
  res.render("search");
});

app.get("/code", async (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    const {login} = req.session.passport.user.data[0];
    const host = `http://localhost:3003`
    const url1 = `${host}/api/bot/channel/${login}`
    const url2 = `${host}/api/bot/channels`
    const responses = await Promise.all([nodeFetch(url1), nodeFetch(url2), {
          method: 'GET',
    }])
    const b = await Promise.all([responses[0].json(), responses[1].json()])
    console.log(b[0], b[1])
    // ^ fetches the channel data of the {login}
    if (!b[0].success) {
      // If user doesnt have the bot added, reply with false.
      res.render("code", {
        inChannel: false,
        code: b[1].todaysCode
      });
    } else {
      // If user doesnt have the bot added, reply with true.
      res.render("code", {
        inChannel: true,
        code: b[1].todaysCode
      });
    }
  } else {
    // If user is not logged in, redirect to login.
    res.render("authorize");
  }
});

app.get("/denied", (req, res) => {
  res.render("accessDenied");
});

app.get("/dashboard", async (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    const {login} = req.session.passport.user.data[0];
    //console.log(login)
    const data = await nodeFetch(`http://localhost:3003/api/bot/channel/${login}`, {
      method: "GET",
    });
    const b = await data.json()
    //console.log(b)
    if (!b.success) {
      // If user doesnt have the bot added, render add bot button.
      res.render("dashboardButNoBot")
    } else {
      // If user has the bot added, render dashboard.
      res.render("dashboard", {
        offlineOnly: b.offlineOnly,
        poroOnly: b.poroOnly,
      });
    }
  } else {
    // If user is not logged in, redirect to authorize.
    res.render("authorize");
  }
});

app.get("/leaderboard", async (req, res) => {
    const data = await nodeFetch(`http://localhost:3003/api/bot/leaderboard`, {
          method: "GET",
      });
    const b = await data.json()
    res.render("leaderboard", {
      leaderboard: b.topUsers,
    });
});

app.get("/channel", async (req, res) => {
  const user = req.query.user.toLocaleLowerCase()
  const data = await nodeFetch(`http://localhost:3003/api/bot/porocount/${user}`, {
    method: "GET",
  });
  const poroCount = await data.json();
  if (!poroCount.success) {
    return res.render("error");
  }
  const joinedAt = humanizeDuration(new Date() - Date.parse(poroCount.joinedAt));
  const api = await axios.get(
    `https://api.ivr.fi/twitch/resolve/${req.query.user.toLowerCase()}`
  );
  res.render("channel", {
    poroInfo: poroCount,
    register: joinedAt,
    api: api.data,
    myPoroRank: poroCount.userRank,
    AllPoroRank: poroCount.totalRank,
  });
});

// Listen on port 3001
app.listen(port, () => console.info(`Listening on port ${port}`));
