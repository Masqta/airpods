# 🎧 AirStore Bulgaria - Neon Database Setup Guide

## 📋 What Was Created

This is a complete e-commerce website with **Neon PostgreSQL database** integration. All data is now stored permanently in the cloud!

---

## 📁 File Structure

```
airstore-v2/
├── index.html                    ← Main website
├── package.json                  ← Node.js dependencies
├── database-schema.sql           ← Database setup script
├── README.md                     ← This file
├── assets/                       ← Your product images
│   ├── airpods.png              ← Main product photo
│   ├── airpods_2.png            ← Gallery image 2
│   ├── airpods_3.png            ← Gallery image 3
│   ├── ours.png                 ← Comparison - your product
│   └── theirs.png               ← Comparison - competitor
├── admin-094312/                ← Admin panel
│   └── index.html               ← Dashboard for managing orders/reviews
└── netlify/functions/           ← Serverless functions (API)
    ├── save-order.js            ← Save order to database
    ├── get-orders.js            ← Get all orders
    ├── update-order-status.js   ← Change order status
    ├── delete-order.js          ← Delete order
    ├── save-review.js           ← Save review to database
    ├── get-reviews.js           ← Get all reviews
    ├── delete-review.js         ← Delete review
    ├── track-visitor.js         ← Track website visitors
    └── get-stats.js             ← Get dashboard statistics
```

---

## 🚀 Step-by-Step Setup

### **Step 1: Get Your Neon Database Connection String**

1. Go to your **Netlify Dashboard**
2. Click your site
3. Go to **Extensions** → **Neon**
4. Click **"Create Database"**
5. Copy the **Connection String** (looks like):
   ```
   postgresql://user:password@host.neon.tech/database?sslmode=require
   ```

---

### **Step 2: Set Environment Variable in Netlify**

1. In Netlify Dashboard → **Site settings** → **Environment variables**
2. Click **"Add variable"**
3. **Key:** `DATABASE_URL`
4. **Value:** `your-connection-string-here` (paste from Step 1)
5. Click **Save**

---

### **Step 3: Create Database Tables**

You have **2 options** to create the tables:

#### Option A: Using Neon Dashboard (Recommended)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Click **"SQL Editor"**
4. Copy and paste the contents of `database-schema.sql`
5. Click **"Run"**

#### Option B: Using psql Command Line

```bash
# Install psql if you don't have it
# Then run:
psql "your-connection-string" -f database-schema.sql
```

---

### **Step 4: Install Dependencies**

```bash
# In your project folder:
npm install
```

This installs the `pg` (PostgreSQL) library that the functions need.

---

### **Step 5: Deploy to Netlify**

```bash
# If using Netlify CLI:
netlify deploy --prod

# Or push to GitHub and connect to Netlify
```

---

## 🎁 Promo Codes (10% Discount)

These codes are hardcoded in `index.html` (line ~799):

```javascript
const VALID_PROMO_CODES = [
  'A1B2C3',
  'X7Y8Z9', 
  'P5Q6R7',
  'M3N4O5',
  'D8E9F0',
  'SAVE10',
  'AIR10',
  'PROMO1'
];
```

To add more codes, edit this array in `index.html`.

---

## 📊 Admin Panel

**URL:** `your-site.com/admin-094312/`

**Login:**
- Username: `vankoadmin`
- Password: `vanko094312`

### Features:
- 📊 **Dashboard** - View statistics (orders, revenue, visitors, reviews)
- 📦 **Orders** - View all orders, change status, delete orders
- ⭐ **Reviews** - View all reviews, add reviews, delete reviews

---

## 💾 What Data is Stored Where?

| Data | Storage | Persistent? |
|------|---------|-------------|
| **Orders** | Neon PostgreSQL | ✅ Yes - Forever |
| **Reviews** | Neon PostgreSQL | ✅ Yes - Forever |
| **Visitors** | Neon PostgreSQL | ✅ Yes - Forever |
| **Cart items** | Browser only | ❌ Lost on refresh |
| **Countdown timer** | Browser LocalStorage | ❌ Per device |

---

## 🔌 API Endpoints (Netlify Functions)

Your site now has these API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/.netlify/functions/save-order` | POST | Save new order |
| `/.netlify/functions/get-orders` | GET | Get all orders |
| `/.netlify/functions/update-order-status` | PUT | Update order status |
| `/.netlify/functions/delete-order` | DELETE | Delete order |
| `/.netlify/functions/save-review` | POST | Save new review |
| `/.netlify/functions/get-reviews` | GET | Get all reviews |
| `/.netlify/functions/delete-review` | DELETE | Delete review |
| `/.netlify/functions/track-visitor` | POST | Track visitor |
| `/.netlify/functions/get-stats` | GET | Get dashboard stats |

---

## 🛠️ Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    courier VARCHAR(50),
    delivery_type VARCHAR(50),
    address TEXT,
    qty INTEGER,
    total_eur DECIMAL(10,2),
    total_bgn DECIMAL(10,2),
    promo_code VARCHAR(20),
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Visitors Table
```sql
CREATE TABLE visitors (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(50),
    user_agent TEXT,
    visited_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⚠️ Troubleshooting

### "Error saving order" message
- Check that `DATABASE_URL` environment variable is set
- Check that database tables are created
- Check Netlify Functions logs in dashboard

### Reviews not showing
- Database may be empty initially
- Sample reviews are added when you run `database-schema.sql`

### Admin panel not loading data
- Make sure you're logged in
- Check browser console for errors
- Verify database connection

---

## 📝 To Change Prices

Edit in `index.html`:
```javascript
const PRICE_EUR = 45;      // Your price
const OLD_EUR = 72.58;     // Compare price
```

---

## 🎨 To Add Your Photos

Place these files in `/assets/` folder:
- `airpods.png` - Main product image
- `airpods_2.png` - Gallery thumbnail 2
- `airpods_3.png` - Gallery thumbnail 3
- `ours.png` - Your product for comparison slider
- `theirs.png` - Competitor product for comparison slider

---

## 💡 Free Tier Limits

| Service | Free Limit |
|---------|-----------|
| **Neon** | 500 MB storage |
| **Netlify Functions** | 125,000 calls/month |
| **Netlify Forms** | 100 submissions/month |

---

## 📞 Support

If you have issues:
1. Check Netlify Functions logs in dashboard
2. Check Neon database query logs
3. Open browser console (F12) for JavaScript errors

---

**Your site is now ready with a real database!** 🚀
