const express = require('express');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/reportController');

const r = express.Router();

r.use(authenticate);


r.get('/sales', ctrl.dailySales);
r.get('/profit', ctrl.monthlyProfit);
r.get('/expenses', ctrl.expenseBreakdown);
r.get('/product-performance', ctrl.productPerformance);

r.get('/requests-summary', ctrl.requestsSummary);

module.exports = r;