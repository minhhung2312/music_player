const express = require('express');
const router = express.Router();

const { auth, requireAdmin } = require('../middlewares/auth');
const { mongooseToObject } = require('../../util/mongoose');
const adminController = require('../controllers/AdminController');

router.get('/', auth, requireAdmin, adminController.index);

module.exports = router;
