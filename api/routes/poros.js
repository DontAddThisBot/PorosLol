const express = require("express");

const router = express.Router();

router.get("/lookup/:user", async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send("No user specified");
    }

    const lastUsage = await bot.Redis.get(`poro:${req.params.user}`);
    const channelData = await bot.DB.poroCount.findOne({ username: req.params.user }).exec();

    if (!channelData) {
        return res.status(404).send("User not found");
    }

    if (!lastUsage) {
        res.json({
            cooldown: false,
            lastUsage: lastUsage,
            poroCount: channelData.poroCount,
            joinedAt: channelData.joinedAt,
            poroPrestige: channelData.poroPrestige,
        });
    } else {
        res.json({
            cooldown: true,
            lastUsage: lastUsage,
            poro: { 
            poroCount: channelData.poroCount,
            joinedAt: channelData.joinedAt,
            poroPrestige: channelData.poroPrestige,
            }
        });
    }
});

module.exports = router;