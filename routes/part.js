const express = require('express');
const router = express.Router();
const { client } = require('../../util/connections')
const utils = require('../../util/utils');

router.post(`/api/bot/part`, async (req, res) => {
    const { username } = req.query;
    if (!username || !/^[A-Z_\d]{4,25}$/i.test(username)) {
        return res.status(400).json({
            success: false,
            message: "malformed username parameter",
        });
    }
    // Look up their ID
    const id = await utils.getUID(username);

    // Get user from db
    const user = await bot.DB.channels.findOne({ id: id }).exec();
    if (user) {
        // If the user doesn't exist at all, join the channel.
        try {
            await client.part(username);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to part chat.',
            });
        }

        // Save to DB
        try {
            await bot.DB.channels.findOneAndDelete({ id: id }).exec();
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete to datastore.',
            });
        }

        return res.status(200).json({
            success: true,
        });
    }
})

module.exports = router;