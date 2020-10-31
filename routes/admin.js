const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');


router.get('/edit-list', adminController.editList);

module.exports = router