const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/edit-list', adminController.editList);

router.post('/delete/:id', adminController.deleteItem);

router.post('/edit-name', adminController.editName);

module.exports = router