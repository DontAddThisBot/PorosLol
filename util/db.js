require("dotenv").config();
const DB = require("mongoose");

DB.connect(`${process.env.mongoDB}`, {});

DB.connection.on("connected", () => {
    console.log(`Connected to database!`);
});

DB.connection.on("disconnected", () => {
    console.error("Disconnected from database");
});

//Emote Schema
const ChannelsSchema = new DB.Schema({
    username: String,
    id: String,
    joinedAt: Date,
    prefix: String,
    poroOnly: false,
    offlineOnly: false,
});

const PoroSchema = new DB.Schema({
    username: String,
    id: String,
    joinedAt: Date,
    poroCount: Number,
    poroPrestige: Number,
});

const UserSchema = new DB.Schema({
    id: String,
    username: String,
    firstSeen: Date,
    level: Number,
});

const CodeSchema = new DB.Schema({
    hint: String,
    code: String
})

exports.users = DB.model("users", UserSchema);
exports.poroCount = DB.model("poroCount", PoroSchema);
exports.poroPrestige = DB.model("poroPrestige", PoroSchema);
exports.joinedAt = DB.model("joinedAt", PoroSchema);
exports.channels = DB.model("channels", ChannelsSchema);
exports.codes = DB.model('code', CodeSchema);