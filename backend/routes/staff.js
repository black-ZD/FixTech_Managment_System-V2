const express = require('express');
const { body } = require('express-validator');
const { authenticate, adminOnly } = require('../middleware/auth');
const ctrl = require('../controllers/staffController');
const r = express.Router();

const v = [body('name').notEmpty().trim(), body('role').notEmpty().trim(), body('salary').isFloat({min:0}), body('hire_date').isDate()];

r.use(authenticate);
r.get('/',            ctrl.getAll);
r.get('/attendance',  ctrl.getAttendance);
r.post('/',           adminOnly, v, ctrl.create);
r.put('/:id',         adminOnly, v, ctrl.update);
r.delete('/:id',      adminOnly, ctrl.remove);
r.post('/attendance', [body('staff_id').isInt({min:1}), body('date').isDate(), body('status').isIn(['present','absent','late'])], ctrl.markAttendance);
module.exports = r;
