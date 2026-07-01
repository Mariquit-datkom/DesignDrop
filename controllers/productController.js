const productModel = require('../models/productModel');

async function showProducts(req, res) {
    try {
        const products = await productModel.getSellerProducts(req.session.user.id);

        res.render('seller/products', {
            user: req.session.user,
            currentPath: req.path,
            products
        });

    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load products.');
        res.redirect('/seller/dashboard');
    }
}

function showNewProductForm(req, res) {
    res.render('seller/newProduct', {
        user: req.session.user,
        currentPath: req.path
    });
}

async function createProduct(req, res) {
    const { title, description, price } = req.body;

    try {
        if (!title?.trim() || !price) {
            req.flash('error', 'Title and price are required.');
            return res.redirect('/seller/products/new');
        }

        const cleanTitle = title.trim();
        const cleanDescription = description?.trim() || '';
        const cleanPrice = parseFloat(price);

        if (isNaN(cleanPrice) || cleanPrice < 0) {
            req.flash('error', 'Invalid price.');
            return res.redirect('/seller/products/new');
        }

        await productModel.createProduct(
            req.session.user.id,
            cleanTitle,
            cleanDescription,
            cleanPrice
        );

        req.flash('success', 'Product added successfully.');
        res.redirect('/seller/products');

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong.');
        res.redirect('/seller/products/new');
    }
}

module.exports = {
    showProducts,
    showNewProductForm,
    createProduct
};