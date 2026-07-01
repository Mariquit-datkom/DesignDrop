const express = require('express');
const router = express.Router();
const {requireSeller} = require('../middleware/roleMiddleware');
const productController = require('../controllers/productController');

const pages = ['dashboard', 'products', 'orders', 'analytics', 'settings'];
pages.forEach(page => {
    router.get(`/seller/${page}`, requireSeller, (req, res) => {
        res.render(`seller/${page}`, {
            user: req.session.user,
            currentPath: req.path
        });
    });
});

router.get('/seller/products', requireSeller, productController.showProducts);

router.get('/seller/products/new', requireSeller, productController.showNewProductForm);

router.post('/seller/products', requireSeller, productController.createProduct);

module.exports = router;