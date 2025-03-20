const express = require('express');
const router = express.Router();

const siteController = require('../controllers/SiteController');
const { auth } = require('../middlewares/auth');

router.get('/', auth, siteController.index);

module.exports = router;
