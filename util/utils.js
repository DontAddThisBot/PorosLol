require("dotenv").config();
const got = require('got');

exports.getPFP = async (userID) => {
    if (!userID) return null
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}`, { responseType: 'json', throwHttpErrors: false })
    if (!userData.body.id) return null
    return userData.body.logo
};

exports.getUID = async (username) => {
    if (!username) return null
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(username)}`, { responseType: 'json', throwHttpErrors: false })
    if (!userData.body.id) return null
    return userData.body.id
};