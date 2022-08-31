const fetch = require('node-fetch');

const HOSTNAME = 'http://localhost:3002/api';

exports.partChannelByUsername = async (username) => {
    const r = await fetch(`${HOSTNAME}/bot/part?username=${encodeURIComponent(username)}`, {
        method: 'POST',
    });
    const b = await r.json();
    return b;
};

exports.joinChannelByUsername = async (username) => {
    const r = await fetch(`${HOSTNAME}/bot/join?username=${encodeURIComponent(username)}`, {
        method: 'POST',
    });
    const b = await r.json();
    return b;
};

exports.banUserByUsername = async (username) => {
    const r = await fetch(`${HOSTNAME}/bot/ban?username=${encodeURIComponent(username)}`, {
        method: 'POST',
    });
    const b = await r.json();
    return b;
};

exports.unbanUserByUsername = async (username) => {
    const r = await fetch(`${HOSTNAME}/bot/unban?username=${encodeURIComponent(username)}`, {
        method: 'POST',
    });
    const b = await r.json();
    return b;
};

exports.checkAdmin = async (id) => {
    const r = await fetch(`${HOSTNAME}/bot/checkadmin?id=${encodeURIComponent(id)}`, {
        method: "POST",
    })
    const b = await r.json();
    return b;
};

exports.poroOnly = async (id) => {
    const r = await fetch(`${HOSTNAME}/bot/poro?id=${encodeURIComponent(id)}`, {
        method: "POST",
    })
    const b = await r.json();
    return b;
};

exports.offlineOnly = async (id) => {
    const r = await fetch(`${HOSTNAME}/bot/offline?id=${encodeURIComponent(id)}`, {
        method: "POST",
    })
    const b = await r.json();
    return b;
};

exports.stvOnly = async (id) => {
    const r = await fetch(`${HOSTNAME}/bot/stv?id=${encodeURIComponent(id)}`, {
        method: "POST",
    })
    const b = await r.json();
    return b;
};