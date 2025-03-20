const { mongooseToObject } = require('../../util/mongoose');

class SiteController {
    // [GET] /
    index(req, res) {
        if (req.user.role !== 'admin') {
            return res.redirect('/');
        }
        res.render('admin/dashboard', { user: mongooseToObject(req.user) });
    }
}

module.exports = new SiteController();
