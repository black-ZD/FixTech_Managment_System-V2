const express = require('express');
const { body } = require('express-validator');
const { authenticate, adminOnly } = require('../middleware/auth');
const ctrl = require('../controllers/expenseController');
const r = express.Router();

const v = [body('description').notEmpty().trim(), body('amount').isFloat({min:0.01})];

r.use(authenticate);
r.get('/',        ctrl.getAll);
r.get('/summary', ctrl.getSummary);
r.get('/trend',   ctrl.getMonthlyTrend);
r.post('/',       adminOnly, v, ctrl.create);
r.put('/:id',     adminOnly, v, ctrl.update);
r.delete('/:id',  adminOnly, ctrl.remove);
module.exports = r;
