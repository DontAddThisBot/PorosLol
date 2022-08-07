const express = require('express');
const router = express.Router();
const { banUserByUsername } = require('../rpc/dontaddthisbot')
const { checkAdmin } = require('../rpc/dontaddthisbot')

router.post(`/api/bot/ban`, async (req, res) => {

    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const {id} = req.session.passport.user.data[0];
    const admin = await checkAdmin(id);
    if (!admin.success || !admin.isAdmin) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const {username} = req.query;
    if (!username) {
        return res.status(400).json({
            success: false,
            message: "malformed username parameter",
        });
    }
    const r = await banUserByUsername(username);
    if (!r.success) {
        return res.json({
            success: false,
            message: r.message,
        });
    }

    return res.json({ success: true });
})

module.exports = router;