const express = require('express');
const router = express.Router();
const { partChannelByUsername } = require('../rpc/dontaddthisbot')

router.post(`/api/bot/part`, async (req, res) => {

    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const {login} = req.session.passport.user.data[0];

    const r = await partChannelByUsername(login);
    if (!r.success) {
        return res.json({
            success: false,
            message: r.message,
        });
    }

    return res.json({ success: true });
})

module.exports = router;