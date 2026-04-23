const { validationResult } = require('express-validator');
const svc = require('../services/productService');


const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array()
    });
    return false;
  }
  return true;
};


exports.getAll = async (req, res) => {
  try {
    const data = await svc.getAll();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


exports.getById = async (req, res) => {
  try {
    const data = await svc.getById(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
};


exports.getLowStock = async (req, res) => {
  try {
    const data = await svc.getLowStock(req.query.threshold);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


exports.getStockHistory = async (req, res) => {
  try {
    const data = await svc.getStockHistory(req.query.product_id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


exports.create = async (req, res) => {
  if (!validate(req, res)) return;

  try {
    const data = await svc.create(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


exports.update = async (req, res) => {
  if (!validate(req, res)) return;

  try {
    const data = await svc.update(req.params.id, req.body, req.user.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


exports.remove = async (req, res) => {
  try {
    const data = await svc.softDelete(req.params.id, req.user.id);
    res.json({ success: true, ...data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

