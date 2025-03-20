const { mongooseToObject } = require('../../util/mongoose');

class SiteController {
    // [GET] /
    index(req, res) {
        const user = mongooseToObject(req.user);
        res.render('home', { title: 'Home', user });
    }
}

module.exports = new SiteController();
