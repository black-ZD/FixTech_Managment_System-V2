const express = require('express');
const r = express.Router();
const ctrl = require('../controllers/requestController');
const { authenticate } = require('../middleware/auth');

r.post('/', ctrl.createRequest);
r.get('/', ctrl.getAllRequests);
r.patch('/:id/status', ctrl.updateStatus);
r.put('/:id/status', authenticate, ctrl.updateStatus);

module.exports = r;