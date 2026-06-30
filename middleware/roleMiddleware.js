function requireSeller (req, res, next) {
    if (!req.session.user) return res.redirect('/login');

    if (req.session.user.role !== 'seller') {
        return res.status(403).render('errors/403', {
            message: 'You do not have permission to access this page.'
        });
    }

    next();
}

module.exports = {
    requireSeller
}