// salesController.js
const { validationResult } = require('express-validator');
const svc = require('../services/salesService');

exports.getAll        = async (req,res) => { try { res.json({ success:true, data: await svc.getAll() }); } catch(e){ res.status(500).json({success:false,message:e.message}); } };
exports.getDailySales = async (req,res) => { try { res.json({ success:true, data: await svc.getDailySales() }); } catch(e){ res.status(500).json({success:false,message:e.message}); } };
exports.getMonthlySales = async (req,res) => { try { res.json({ success:true, data: await svc.getMonthlySales() }); } catch(e){ res.status(500).json({success:false,message:e.message}); } };

exports.create = async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });
  try {
    const sale = await svc.create(req.body, req.user.id);
    res.status(201).json({ success:true, data: sale });
  } catch(e) { res.status(400).json({ success:false, message: e.message }); }
};
