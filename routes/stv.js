const express = require('express');
const router = express.Router();
const { stvOnly } = require('../rpc/dontaddthisbot')

router.post(`/api/bot/stv`, async (req, res) => {

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
    const r = await stvOnly(id);
    if (!r.success) {
        return res.json({
            success: false,
            message: r.message,
        });
    }

    return res.json({ success: true });
})

module.exports = router;