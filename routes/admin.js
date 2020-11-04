const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');


router.get('/edit-list', adminController.editList);

router.post('/delete', adminController.deleteItem);

module.exports = router