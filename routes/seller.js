const express = require('express');
const router = express.Router();
const {requireSeller} = require('../middleware/roleMiddleware');

const pages = ['dashboard', 'products', 'orders', 'analytics'];

pages.forEach(page => {
    router.get(`/seller/${page}`, requireSeller, (req, res) => {
        res.render(`seller/${page}`, {
            user: req.session.user,
            currentPath: req.path
        });
    });
});

module.exports = router;