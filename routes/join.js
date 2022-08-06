const express = require('express');
const router = express.Router();
const { joinChannelByUsername } = require('../rpc/dontaddthisbot')
const { checkAdmin } = require('../rpc/dontaddthisbot')

router.post(`/api/bot/join`, async (req, res) => {
    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const {id, login} = req.session.passport.user.data[0];

    const admin = await checkAdmin(id);
    if (!admin.success || !admin.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized',
        });
    }

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