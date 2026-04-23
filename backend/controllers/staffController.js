const { validationResult } = require('express-validator');
const svc = require('../services/staffService');

const ok = (req,res)=>{ const e=validationResult(req); if(!e.isEmpty()){res.status(400).json({success:false,errors:e.array()});return false;}return true; };

exports.getAll          = async(req,res)=>{ try{res.json({success:true,data:await svc.getAll()});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.create          = async(req,res)=>{ if(!ok(req,res))return; try{res.status(201).json({success:true,data:await svc.create(req.body,req.user.id)});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.update          = async(req,res)=>{ if(!ok(req,res))return; try{res.json({success:true,data:await svc.update(req.params.id,req.body,req.user.id)});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.remove          = async(req,res)=>{ try{res.json({success:true,...(await svc.remove(req.params.id,req.user.id))});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.markAttendance  = async(req,res)=>{ if(!ok(req,res))return; try{const{staff_id,date,status}=req.body; res.json({success:true,data:await svc.markAttendance(staff_id,date,status,req.user.id)});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.getAttendance   = async(req,res)=>{ try{res.json({success:true,data:await svc.getAttendance(req.query.staff_id)});}catch(e){res.status(500).json({success:false,message:e.message});} };
