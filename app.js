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
require("./api/server");
const humanizeDuration = require("./humanizeDuration");
const axios = require("axios");

const app = express();
const port = 3001;

// Static Files
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
app.use(passport.initialize());
app.use(passport.session());
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
      console.log(JSON.parse(body));
    } else {
      done(JSON.parse(body));
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
  const channels = await bot.DB.channels.find({}).exec();
  if (req.session && req.session.passport && req.session.passport.user) {
    const user = req.session.passport.user;
    const levelRank = await bot.DB.users
      .findOne({ id: user.data[0].id })
      .exec();
    if (!levelRank) {
      const userdata = new bot.DB.users({
        id: user.data[0].id,
        username: user.data[0].login,
        firstSeen: new Date(),
        prefix: "|",
        level: 1,
      });
      await userdata.save();
      res.render("index", {
        // if login success but not in database user must retry.
        channels: channels.length.toLocaleString(),
      });
    } else {
      res.render("success", {
        // if login success
        username: user.data[0].display_name,
        avatar: user.data[0].profile_image_url,
        bio: user.data[0].description,
        channels: channels.length.toLocaleString(),
        rank: levelRank.level,
      });
    }
  } else {
    res.render("index", {
      // if login faile
      channels: channels.length.toLocaleString(),
    });
  }
});

app.get("/admin", async (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    const user = req.session.passport.user;
    const levelRank = await bot.DB.users
      .findOne({ id: user.data[0].id })
      .exec();
    if (levelRank.level > 1) {
      await bot.DB.users
        .updateOne(
          {
            username: req.query.userBan
              ?.toLowerCase()
              .replace(/kattah|fookstee|turtoise|zonianmidian|liptongod/i, ""),
          },
          { level: 0 }
        )
        .exec();
      await bot.DB.users
        .updateOne(
          {
            username: req.query.userUnban
              ?.toLowerCase()
              .replace(/kattah|fookstee|turtoise|zonianmidian|liptongod/i, ""),
          },
          { level: 1 }
        )
        .exec();
      res.render("admin", {
        rank: levelRank.level,
      });
    } else {
      res.redirect("/denied");
    }
  } else {
    res.redirect("/");
  }
});

app.get("/commands", (req, res) => {
  res.render("commands", { text: "Commands" });
});

app.get("/search", (req, res) => {
  res.render("search");
});

app.get("/test", (req, res) => {
  res.render("test");
});

app.get("/code", (req, res) => {
  res.render("code");
});

app.get("/denied", (req, res) => {
  res.render("accessDenied");
});

app.get("/leaderboard", (req, res) => {
  bot.DB.poroCount.find({}).exec(function (err, kekw) {
    if (err) throw err;

    const topUsers = kekw
      .sort(
        (a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount
      )
      .slice(0, 10)
      .map(
        (user) =>
          `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount}`
      );

    res.render("leaderboard", { topUsers });
  });
});

app.get("/channel", async (req, res) => {
  const kekw2 = await bot.DB.poroCount
    .findOne({ username: req.query.user.toLowerCase() })
    .exec();
  if (!kekw2) {
    return res.render("error");
  }
  var today = new Date();
  const timestamp = new Date(kekw2.joinedAt);
  const diffTime = Math.abs(today - timestamp);
  const registerDate = humanizeDuration(diffTime);
  const api = await axios.get(
    `https://api.ivr.fi/twitch/resolve/${req.query.user.toLowerCase()}`
  );
  const poroData = await bot.DB.poroCount.find({}).exec();
  const myRank =
    poroData
      .sort(
        (a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount
      )
      .findIndex((user) => user.username == req.query.user.toLowerCase()) + 1;
  res.render("channel", {
    xd: kekw2,
    register: registerDate,
    api: api.data,
    myPoroRank: myRank,
    AllPoroRank: poroData.length.toLocaleString(),
  });
});

// Listen on port 3001
app.listen(port, () => console.info(`Listening on port ${port}`));
