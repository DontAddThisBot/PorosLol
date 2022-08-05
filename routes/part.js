const express = require('express');
const router = express.Router();

router.post(`/api/bot/part`, async (req, res) => {

    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const {username} = req.session.passport.user.data[0];

    const r = await partChannelByUsername(username);
    if (!r.success) {
        return res.json({
            success: false,
            message: r.message,
        });
    }

    return res.json({ success: true });
})

module.exports = router;