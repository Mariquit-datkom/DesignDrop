const express = require('express');
const router = express.Router();
const {requireSeller} = require('../middleware/roleMiddleware');

router.get('/seller/dashboard', requireSeller, (req, res, next) => {
    res.render('seller/dashboard', {
        user: req.session.user
    });
});

module.exports = router;