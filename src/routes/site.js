const express = require('express');
const router = express.Router();

const siteController = require('../app/Controllers/SiteController');

//newsController.index()
router.get('/search', siteController.search);
router.get('/login',siteController.showlogin)
router.get('/', siteController.index);
router.post('/login',siteController.login)
module.exports = router;
