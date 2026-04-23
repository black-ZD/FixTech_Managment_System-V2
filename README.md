# FixTech Management System V2

Full-stack business management system for an electricity and computer shop.

---

## What's New in V2

| Feature               | V1 | V2 |
|-----------------------|----|----|
| Refresh token rotation | ✗ | ✓ |
| Login activity log     | ✗ | ✓ |
| Soft delete (products) | ✗ | ✓ |
| Stock history tracking | ✗ | ✓ |
| Audit logs             | ✗ | ✓ |
| Reports page (4 types) | ✗ | ✓ |
| CSV export             | ✗ | ✓ |
| Rate limiting          | ✗ | ✓ |
| Receipt printing       | ✗ | ✓ |
| Expense trend chart    | ✗ | ✓ |
| Product margin display | ✗ | ✓ |
| Late attendance status | ✗ | ✓ |

---

## Tech Stack

- **Frontend**: React 18 + Tailwind CSS + Recharts + Lucide
- **Backend**: Node.js + Express + JWT (access + refresh) + bcrypt
- **Database**: MySQL (10 tables with full FK relationships)

---

## Prerequisites

- Node.js v18+
- MySQL (XAMPP, standalone, or Docker)
- npm

---

## Quick Start

### 1 — Database

```bash
# Start MySQL, then run:
mysql -u root -p < database/schema.sql

# OR import via phpMyAdmin: Import → Select database/schema.sql
```

### 2 — Backend

```bash
cd backend

npm install

# Create environment file
cp .env.example .env
# Edit .env — set DB_PASSWORD (and change JWT secrets for production)

# Seed admin user
npm run seed

# Start dev server
npm run dev
```

Backend runs on: **http://localhost:5000**

### 3 — Frontend

```bash
cd frontend

npm install

npm start
```

Frontend runs on: **http://localhost:3000**

---

## Login

| Field    | Value          |
|----------|----------------|
| Username | loganmullahh   |
| Password | 13135@skynet   |
| Role     | admin          |

---

## Database Tables

| Table           | Purpose                              |
|-----------------|--------------------------------------|
| users           | System accounts                      |
| refresh_tokens  | JWT refresh token store (rotated)    |
| login_activity  | Login time + IP tracking             |
| products        | Inventory with soft delete           |
| sales           | Transaction records                  |
| expenses        | Categorised expense tracking         |
| staff           | Employee records                     |
| attendance      | Daily attendance (present/late/absent)|
| stock_history 🔥| Every stock change — full audit trail|
| audit_logs 🔥   | Every CRUD action with user + detail |

---

## API Endpoints

### Auth
```
POST /api/auth/login          Public   — returns access + refresh tokens
POST /api/auth/refresh-token  Public   — rotates refresh token
POST /api/auth/logout         Public   — revokes refresh token
```

### Products
```
GET    /api/products              Auth    — list all active products
GET    /api/products/low-stock    Auth    — products with qty ≤ threshold
GET    /api/products/stock-history Auth   — full stock change log
GET    /api/products/:id          Auth    — single product
POST   /api/products              Admin   — create product
PUT    /api/products/:id          Admin   — update product
DELETE /api/products/:id          Admin   — soft delete product
```

### Sales
```
GET  /api/sales           Auth  — all sales with product + user join
POST /api/sales           Auth  — record sale (atomic transaction)
GET  /api/sales/daily     Auth  — last 30 days aggregated
GET  /api/sales/monthly   Auth  — last 12 months aggregated
```

### Expenses
```
GET    /api/expenses         Auth   — all expenses
GET    /api/expenses/summary Auth   — totals by category
GET    /api/expenses/trend   Auth   — monthly totals
POST   /api/expenses         Admin  — create
PUT    /api/expenses/:id     Admin  — update
DELETE /api/expenses/:id     Admin  — delete
```

### Staff
```
GET    /api/staff              Auth   — all staff
GET    /api/staff/attendance   Auth   — attendance log
POST   /api/staff              Admin  — add staff
PUT    /api/staff/:id          Admin  — update staff
DELETE /api/staff/:id          Admin  — remove staff
POST   /api/staff/attendance   Auth   — mark attendance
```

### Reports (V2)
```
GET /api/reports/sales               Auth — daily sales (last N days)
GET /api/reports/profit              Auth — monthly profit vs expenses
GET /api/reports/expenses            Auth — expense category breakdown
GET /api/reports/product-performance Auth — per-product revenue/profit
```

### Dashboard
```
GET /api/dashboard   Auth — aggregated stats, low stock, best sellers, recent audit
```

---

## Security

- Passwords: bcrypt (rounds: 12)
- Auth: Short-lived JWT access tokens (15m) + rotating refresh tokens (7d)
- Routes: All private routes require `Authorization: Bearer <token>`
- Admin routes: Verified via role check middleware
- Rate limiting: 20 req/15min on auth, 120 req/min on all API
- SQL injection: All queries use parameterised statements
- Secrets: Stored in `.env`, never in code

---

## Business Rules

1. Sales **fail** if stock < requested quantity
2. Every sale runs a **MySQL transaction**: insert sale + update stock + insert stock_history
3. Profit is **auto-calculated** per sale: (sell_price − buy_price) × qty
4. Product deletes are **soft** — `is_deleted = 1`, data preserved
5. All CRUD actions write to **audit_logs** automatically
6. No business logic inside routes — all logic lives in **services/**

---

## Troubleshooting

**MySQL connection failed**
→ Ensure MySQL is running and DB_PASSWORD in `.env` is correct
→ Check that `fixtech_v2` database exists (run schema.sql first)

**Login returns 401**
→ Run `npm run seed` from the backend directory first

**Frontend can't reach API**
→ Verify backend is running on port 5000
→ Check the `"proxy": "http://localhost:5000"` line in frontend/package.json

**Token expired after 15 minutes**
→ This is expected. The frontend auto-refreshes tokens silently via the axios interceptor.
