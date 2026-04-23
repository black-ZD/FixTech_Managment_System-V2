// dashboardController.js
const svc = require('../services/dashboardService');
exports.getStats = async(req,res)=>{ try{res.json({success:true,data:await svc.getStats()});}catch(e){res.status(500).json({success:false,message:e.message});} };

// reportController.js  (exported as separate object — imported individually in routes)
const rSvc = require('../services/reportService');
exports.dailySales          = async(req,res)=>{ try{res.json({success:true,data:await rSvc.dailySalesReport(req.query.days)});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.monthlyProfit       = async(req,res)=>{ try{res.json({success:true,data:await rSvc.monthlyProfitReport()});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.expenseBreakdown    = async(req,res)=>{ try{res.json({success:true,data:await rSvc.expenseBreakdownReport()});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.productPerformance  = async(req,res)=>{ try{res.json({success:true,data:await rSvc.productPerformanceReport()});}catch(e){res.status(500).json({success:false,message:e.message});} };
