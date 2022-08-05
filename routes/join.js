const express = require('express');
const router = express.Router();
const { joinChannelByUsername } = require('../rpc/dontaddthisbot')

router.post(`/api/bot/join`, async (req, res) => {

    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const {login} = req.session.passport.user.data[0];

    const r = await joinChannelByUsername(login);
    if (!r.success) {
        return res.json({
            success: false,
            message: r.message,
        });
    }

    return res.json({ success: true });
})

module.exports = router;