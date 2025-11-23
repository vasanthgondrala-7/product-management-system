# ⚡ Quick Start Guide

Get the Inventory Management System running in 5 minutes!

## 🚀 Fast Setup (Development)

### Prerequisites
```bash
node --version  # Should be 14+
npm --version   # Should be 6+
```

### 1️⃣ Clone & Install (2 minutes)

```bash
# Clone repository
git clone <your-repo-url>
cd inventory-management

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2️⃣ Configure (30 seconds)

```bash
# Create environment file
cp .env.example .env
```

Edit `.env`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3️⃣ Start Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Frontend running on http://localhost:8080

### 4️⃣ Login & Test (1 minute)

1. Open http://localhost:8080
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Test features:
   - ✅ View products
   - ✅ Search products
   - ✅ Add new product
   - ✅ Edit inline
   - ✅ Click row for history
   - ✅ Import sample CSV
   - ✅ Export products

## 📦 Sample Data

### Test CSV Import

Use the included `sample-products.csv`:

```bash
# In the app:
1. Click "Import" button
2. Select "sample-products.csv"
3. See 10 products imported
```

### Manual Test Product
```
Name: Test Product
Unit: pcs
Category: Electronics
Brand: TestBrand
Stock: 50
Status: In Stock
Image: https://via.placeholder.com/400
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Delete database and restart
cd backend
rm inventory.db
npm run dev
```

### Frontend can't connect
```bash
# Check .env file
cat .env
# Should show: VITE_API_BASE_URL=http://localhost:3000/api

# Restart frontend
npm run dev
```

### Port already in use
```bash
# Backend (change in server.js)
PORT=3001 npm run dev

# Frontend (change in vite.config.ts)
# Already configured to use port 8080
```

### CORS errors
```bash
# Ensure backend is running first
# Check backend logs for any errors
```

## 🚢 Production Deployment

### Quick Deploy to Railway + Netlify

**Backend (Railway):**
1. Push code to GitHub
2. Go to railway.app
3. Connect repo → Select backend folder
4. Deploy! ✅

**Frontend (Netlify):**
1. Go to netlify.com
2. Connect repo
3. Set environment:
   - `VITE_API_BASE_URL=<railway-url>/api`
4. Deploy! ✅

**Detailed guide**: See `DEPLOYMENT.md`

## 📚 Next Steps

1. **Customize**: Edit design in `src/index.css`
2. **Add Features**: Extend API in `backend/server.js`
3. **Test Everything**: Use sample CSV data
4. **Deploy**: Follow deployment guide
5. **Submit**: Share your GitHub + live URLs

## 🎯 Key Features to Demo

### Must-Show Features (for HR)
1. ✨ **Beautiful UI** - Professional design
2. 🔍 **Search** - Fast, responsive search
3. ✏️ **Inline Edit** - Click edit, change stock
4. 📊 **History** - Click row to see changes
5. 📥 **Import** - Upload CSV file
6. 📤 **Export** - Download all data
7. ➕ **Add Product** - Full form with validation
8. 🗑️ **Delete** - With confirmation
9. 📱 **Responsive** - Test on mobile
10. 🔐 **Auth** - Login/logout flow

## 🎨 Customization Tips

### Change Colors
Edit `src/index.css`:
```css
:root {
  --primary: 217 91% 60%;  /* Blue */
  --accent: 188 95% 43%;   /* Teal */
}
```

### Add Category
Edit `src/pages/Inventory.tsx`:
```typescript
const categories = ['Electronics', 'Clothing', 'Food', 'YourCategory'];
```

### Change Sample Data
Edit `backend/server.js` - `sampleProducts` array

## 📞 Support

- **Documentation**: See `README.md`
- **Features**: See `FEATURES.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Deployment**: See `DEPLOYMENT.md`

## ✅ Pre-Submission Checklist

- [ ] All features working locally
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Netlify
- [ ] Environment variables configured
- [ ] CSV import/export tested
- [ ] Inventory history working
- [ ] Mobile responsive verified
- [ ] Demo credentials working
- [ ] GitHub repo is public
- [ ] README.md updated with URLs

## 🎉 Success!

Your Inventory Management System is ready!

**Time to deploy**: ~10 minutes
**Time to customize**: As much as you want
**Time to impress**: Immediate! 🚀

---

Need help? Check the detailed docs or create an issue!
