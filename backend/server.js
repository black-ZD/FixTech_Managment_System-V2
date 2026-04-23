require('./config/db');
const app  = require('./app');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀  FixTech V2 API  →  http://localhost:${PORT}`);
  console.log(`📦  Mode: ${process.env.NODE_ENV || 'development'}`);
});
