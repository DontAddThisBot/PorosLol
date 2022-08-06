const got = require('got');

const HOSTNAME = 'http://localhost:3002/api';

exports.partChannelByUsername = async (username) => {
    const { body } = await got(`${HOSTNAME}/bot/part?username=${encodeURIComponent(username)}`, {
        responseType: 'json',
        throwHttpErrors: false,
        method: 'POST',
    });
    return body;
};

exports.joinChannelByUsername = async (username) => {
    const { body } = await got(`${HOSTNAME}/bot/join?username=${encodeURIComponent(username)}`, {
        responseType: 'json',
        throwHttpErrors: false,
        method: 'POST',
    });
    return body;
};