const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null;
        return next(); // Không điều hướng, cho phép render giao diện
    }

    try {
        const decoded = jwt.verify(token, 'secretkey');

        const user = await User.findById(decoded.id);

        if (user) {
            req.user = user;
            res.locals.user = user; // Truyền thông tin user vào biến cục bộ
        } else {
            res.locals.user = null;
        }
    } catch (error) {
        console.error(error);
        res.clearCookie('token');
        res.locals.user = null;
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).render('errors/403');
    }
};

module.exports = { auth, requireAdmin };
