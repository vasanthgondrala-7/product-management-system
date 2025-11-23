# Product Inventory Management System

A full-stack inventory management system built with React, Node.js, Express, and SQLite. Features real-time product tracking, CSV import/export, inline editing, and comprehensive inventory history.

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- ✅ **Product Search & Filtering** - Real-time search and category-based filtering
- ✅ **Interactive Product Table** - View all products with image, details, and status
- ✅ **Inline Editing** - Edit products directly in the table with validation
- ✅ **Add New Products** - Modal form for adding products with all fields
- ✅ **CSV Import/Export** - Bulk import products and export to CSV
- ✅ **Inventory History** - Slide-in panel showing all stock changes
- ✅ **Color-Coded Status** - Green for "In Stock", Red for "Out of Stock"
- ✅ **Authentication** - Login page with protected routes
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Toast Notifications** - User feedback for all actions
- ✅ **Loading States** - Smooth loading indicators

### Backend (Node.js + Express + SQLite)
- ✅ **RESTful API** - Complete CRUD operations
- ✅ **CSV Import** - Duplicate detection and validation
- ✅ **CSV Export** - Download all products as CSV
- ✅ **Product Search** - Case-insensitive partial matching
- ✅ **Update Validation** - Unique name check, stock >= 0
- ✅ **Inventory Logging** - Automatic stock change tracking
- ✅ **History API** - View all changes for any product
- ✅ **Basic Auth** - Simple username/password authentication
- ✅ **Sample Data** - Pre-populated products for testing

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components
- React Query
- React Router
- Sonner (Toasts)
- Lucide Icons

**Backend:**
- Node.js
- Express
- SQLite3
- Multer (File uploads)
- CSV Parse/Stringify
- CORS

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm
- Git

### Frontend Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your backend URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

5. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

The backend will run on `http://localhost:3000`

## 🚢 Deployment

### Frontend (Netlify)

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `VITE_API_BASE_URL=<your-backend-url>`

### Backend (Railway)

1. Create Railway account at https://railway.app

2. Create new project and connect GitHub repository

3. Set root directory to `/backend`

4. Railway will auto-detect Node.js and deploy

5. Get your Railway URL and update frontend `.env`

## 🔐 Authentication

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

## 📊 API Endpoints

### Authentication
```
POST /api/auth/login
Body: { username, password }
```

### Products
```
GET    /api/products              - Get all products
GET    /api/products/search?name  - Search products
POST   /api/products              - Create product
PUT    /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product
GET    /api/products/:id/history  - Get inventory history
```

### Import/Export
```
POST /api/products/import  - Upload CSV file
GET  /api/products/export  - Download CSV
```

## 📝 CSV Format

For imports, use this format:
```csv
name,unit,category,brand,stock,status,image
Laptop Pro 15,pcs,Electronics,TechBrand,45,In Stock,https://example.com/image.jpg
```

## 🎨 Design System

The application uses a modern design system with:
- **Primary Color**: Blue (#2563EB) - Professional & trustworthy
- **Accent Color**: Teal (#06B6D4) - Interactive elements
- **Success**: Green - "In Stock" status
- **Destructive**: Red - "Out of Stock" status
- **Semantic Tokens**: All colors defined in design system
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects

## 🧪 Testing

### Manual Testing
1. Login with demo credentials
2. Search and filter products
3. Edit a product inline
4. Add a new product
5. Import sample CSV
6. Export products to CSV
7. View inventory history
8. Delete a product

### Sample CSV for Testing
Create a file named `sample-products.csv`:
```csv
name,unit,category,brand,stock,status,image
Test Product 1,pcs,Electronics,TestBrand,100,In Stock,
Test Product 2,kg,Food,FoodCo,50,In Stock,
Test Product 3,pcs,Clothing,FashionBrand,0,Out of Stock,
```

## 🐛 Troubleshooting

**CORS Issues:**
- Ensure backend CORS is enabled
- Check API URL in frontend `.env`

**Database Issues:**
- Delete `inventory.db` to reset database
- Restart backend server

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`

## 📄 License

ISC

## 👨‍💻 Author

Built with ❤️ for the Skillwise Assignment

## 🔗 Links

- **GitHub Repository**: <your-repo-url>
- **Live Frontend**: <netlify-url>
- **Live Backend**: <railway-url>

## 📸 Screenshots

[Add screenshots of your application here]

## ✨ Future Enhancements

- [ ] Advanced filtering and sorting
- [ ] User management system
- [ ] Role-based permissions
- [ ] Email notifications
- [ ] Barcode scanning
- [ ] Analytics dashboard
- [ ] Multi-warehouse support
- [ ] Automated reordering
