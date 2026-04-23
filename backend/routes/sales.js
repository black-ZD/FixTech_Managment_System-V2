// routes/sales.js
const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/salesController');
const r = express.Router();
r.use(authenticate);
r.get('/',        ctrl.getAll);
r.get('/daily',   ctrl.getDailySales);
r.get('/monthly', ctrl.getMonthlySales);
r.post('/', [body('product_id').isInt({min:1}), body('quantity').isInt({min:1})], ctrl.create);
module.exports = r;
