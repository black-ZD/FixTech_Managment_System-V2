const db = require('../config/db');


exports.createRequest = async (req, res) => {
  try {
    const {
      request_type,
      name,
      phone,
      product_id,
      product_name,
      is_custom_product,
      quantity,
      location,
      message
    } = req.body;

    const sql = `
      INSERT INTO requests
      (request_type, name, phone, product_id, product_name,
       is_custom_product, quantity, location, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      request_type,
      name,
      phone,
      product_id || null,
      product_name || null,
      is_custom_product ? 1 : 0,
      quantity || 1,
      location || null,
      message || null
    ]);

    // 🔔 THIS IS WHERE ADMIN NOTIFICATION STARTS
    console.log("NEW REQUEST:", {
      id: result.insertId,
      request_type,
      name,
      phone
    });

    res.status(201).json({
      success: true,
      id: result.insertId
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.getAllRequests = async (req, res) => {
  const [rows] = await db.execute(`
    SELECT r.*,
           u.username AS assigned_to_name
    FROM requests r
    LEFT JOIN users u ON r.assigned_to = u.id
    ORDER BY r.created_at DESC
  `);

  res.json({ data: rows });
};
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assigned_to } = req.body;

  await db.execute(
    `UPDATE requests SET status=?, assigned_to=? WHERE id=?`,
    [status, assigned_to || null, id]
  );

  res.json({ message: "Request updated" });
};