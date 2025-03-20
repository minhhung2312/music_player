const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
    // [GET] /auth/register
    showRegister(req, res) {
        res.render('auth/register');
    }

    // [POST] /auth/register
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const errors = {};

            // 👉 Kiểm tra các trường bắt buộc
            if (!username) errors.username = 'Username is required';
            if (!email) errors.email = 'Email is required';
            if (!password) errors.password = 'Password is required';

            // 👉 Nếu có lỗi, trả về ngay
            if (Object.keys(errors).length > 0) {
                return res
                    .status(400)
                    .render('auth/register', { errors, username, email });
            }

            // 👉 Tạo tài khoản người dùng
            const user = new User({ username, email, password });
            await user.save();

            // ✅ Tạo token và đăng nhập ngay sau khi đăng ký
            const token = jwt.sign({ id: user._id }, 'secretkey', {
                expiresIn: '1h',
            });
            res.cookie('token', token, { httpOnly: true });

            // ✅ Điều hướng theo vai trò
            if (user.role === 'admin') {
                return res.redirect('/admin');
            } else {
                return res.redirect('/');
            }
        } catch (error) {
            const errors = {};

            // 👉 Lỗi validation của mongoose
            if (error.name === 'ValidationError') {
                for (let field in error.errors) {
                    errors[field] = error.errors[field].message;
                }
            }

            // 👉 Lỗi email đã tồn tại
            if (error.code === 11000 && error.keyPattern.email) {
                errors.email = 'Email is already registered';
            }

            return res.status(400).render('auth/register', {
                errors,
                username: req.body.username,
                email: req.body.email,
            });
        }
    }

    // [GET] /auth/login
    showLogin(req, res) {
        res.render('auth/login');
    }

    // [POST] /auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const errors = {};

            if (!email) errors.email = 'Email is required';
            if (!password) errors.password = 'Password is required';

            if (Object.keys(errors).length > 0) {
                return res.status(400).render('auth/login', { errors, email });
            }

            const user = await User.findOne({ email });
            if (!user) {
                errors.email = 'User not found';
                return res.status(400).render('auth/login', { errors, email });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                errors.password = 'Invalid password';
                return res.status(400).render('auth/login', { errors, email });
            }

            // ✅ Tạo token và lưu vào cookie
            const token = jwt.sign({ id: user._id }, 'secretkey', {
                expiresIn: '1h',
            });
            res.cookie('token', token, { httpOnly: true });

            // ✅ Điều hướng theo vai trò
            if (user.role === 'admin') {
                return res.redirect('/admin');
            } else {
                return res.redirect('/');
            }
        } catch (error) {
            console.error(error);
            res.status(400).render('auth/login', {
                errors: { general: 'Something went wrong. Please try again.' },
            });
        }
    }

    // [GET] /auth/logout
    logout(req, res) {
        res.clearCookie('token');
        res.redirect('/');
    }
}

module.exports = new AuthController();
