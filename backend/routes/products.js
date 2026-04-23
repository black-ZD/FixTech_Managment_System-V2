const express = require('express');
const { authenticate, adminOnly } = require('../middleware/auth');
const ctrl = require('../controllers/product.controller');

if (!ctrl.search) throw new Error("product.controller.search missing");
const asyncHandler = require('../middleware/asyncHandler');
const r = express.Router();

r.get('/search', asyncHandler(ctrl.search));

r.use(authenticate);

r.get('/', asyncHandler(ctrl.getAll));
r.get('/low-stock', asyncHandler(ctrl.getLowStock));
r.get('/stock-history', asyncHandler(ctrl.getStockHistory));
r.get('/:id', asyncHandler(ctrl.getById));

r.post('/', adminOnly, asyncHandler(ctrl.create));
r.put('/:id', adminOnly, asyncHandler(ctrl.update));
r.delete('/:id', adminOnly, asyncHandler(ctrl.remove));

module.exports = r;