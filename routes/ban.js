const express = require('express');
const router = express.Router();
const { banUserByUsername } = require('../rpc/dontaddthisbot')

router.post(`/api/bot/ban`, async (req, res) => {

    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const r = await banUserByUsername(req.body.banUser);
    if (!r.success) {
        return res.json({
            success: false,
            message: r.message,
        });
    }

    return res.json({ success: true });
})

module.exports = router;