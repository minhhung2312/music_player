const siteRouter = require('./site');
const authRouter = require('./auth');
const adminRouter = require('./admin');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/admin', adminRouter);
    app.use('/', siteRouter);
}

module.exports = route;
