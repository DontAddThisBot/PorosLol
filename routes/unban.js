const express = require('express');
const router = express.Router();
const { unbanUserByUsername } = require('../rpc/dontaddthisbot')

router.post(`/api/bot/join`, async (req, res) => {

    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const username = document.getElementById('username').value;

    const r = await unbanUserByUsername(username);
    if (!r.success) {
        return res.json({
            success: false,
            message: r.message,
        });
    }

    return res.json({ success: true });
})

module.exports = router;