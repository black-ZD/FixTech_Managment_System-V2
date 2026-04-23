const rSvc = require('../services/reportService');

exports.dailySales         = async(req,res)=>{ try{res.json({success:true,data:await rSvc.dailySalesReport(req.query.days)});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.monthlyProfit      = async(req,res)=>{ try{res.json({success:true,data:await rSvc.monthlyProfitReport()});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.expenseBreakdown   = async(req,res)=>{ try{res.json({success:true,data:await rSvc.expenseBreakdownReport()});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.productPerformance = async(req,res)=>{ try{res.json({success:true,data:await rSvc.productPerformanceReport()});}catch(e){res.status(500).json({success:false,message:e.message});} };
exports.requestsSummary = async (req, res) => {
  try {
    const data = await Svc.getRequestsSummary();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error("REQUESTS SUMMARY ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Failed to load requests summary"
    });
  }
};