const svc = require('../services/productservice');

exports.search = async (req, res) => {
  const q = req.query.q || "";
  const data = await svc.search(q);

  res.json({ success: true, data });
};