const express = require('express');
const router = express.Router();
const { offlineOnly } = require('../rpc/dontaddthisbot')

router.post(`/api/bot/offline`, async (req, res) => {

    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const {id} = req.session.passport.user.data[0];

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "malformed username parameter",
        });
    }
    const r = await offlineOnly(id);
    if (!r.success) {
        return res.json({
            success: false,
            message: r.message,
        });
    }

    return res.json({ success: true });
})

module.exports = router;