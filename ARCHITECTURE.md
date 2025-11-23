# 🏗️ Architecture & Design

Technical architecture documentation for the Inventory Management System.

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────┐       │
│  │   React    │  │ React Router │  │  React Query  │       │
│  │ TypeScript │  │  (Routing)   │  │   (State)     │       │
│  └────────────┘  └──────────────┘  └───────────────┘       │
│         │                │                   │               │
│         └────────────────┴───────────────────┘               │
│                          │                                   │
│                    Axios/Fetch                               │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                    HTTPS/REST API
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          ▼                                    │
│                   EXPRESS SERVER                              │
│  ┌────────────────────────────────────────────────────┐      │
│  │                  API Routes                         │      │
│  │  /api/products | /api/auth | /api/products/import  │      │
│  └────────────────────────────────────────────────────┘      │
│         │                                                     │
│         ▼                                                     │
│  ┌────────────────────────────────────────────────────┐      │
│  │              Business Logic                         │      │
│  │  Validation | Authentication | File Processing     │      │
│  └────────────────────────────────────────────────────┘      │
│         │                                                     │
│         ▼                                                     │
│  ┌────────────────────────────────────────────────────┐      │
│  │                SQLite Database                      │      │
│  │  Tables: products, inventory_logs                  │      │
│  └────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────┘
```

## 🗂️ Project Structure

```
inventory-management/
├── 📁 frontend (React App)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    # Shadcn UI components
│   │   │   ├── ProductsTable.tsx      # Main table component
│   │   │   ├── InventoryHistory.tsx   # History sidebar
│   │   │   └── AddProductDialog.tsx   # Add product modal
│   │   ├── pages/
│   │   │   ├── Login.tsx             # Authentication page
│   │   │   ├── Inventory.tsx         # Main inventory page
│   │   │   └── NotFound.tsx          # 404 page
│   │   ├── lib/
│   │   │   ├── api.ts                # API client functions
│   │   │   └── utils.ts              # Utility functions
│   │   ├── App.tsx                   # Root component
│   │   └── main.tsx                  # Entry point
│   ├── public/
│   │   └── _redirects               # Netlify routing config
│   ├── index.html                   # HTML template
│   ├── tailwind.config.ts          # Tailwind configuration
│   └── vite.config.ts              # Vite configuration
│
├── 📁 backend (Node.js API)
│   ├── server.js                   # Express server
│   ├── package.json               # Dependencies
│   ├── inventory.db              # SQLite database
│   └── uploads/                  # Temporary CSV uploads
│
├── 📄 Documentation
│   ├── README.md                 # Main documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── FEATURES.md              # Feature list
│   └── ARCHITECTURE.md          # This file
│
└── 📄 Configuration
    ├── .env.example             # Environment template
    ├── netlify.toml            # Netlify config
    └── sample-products.csv     # Sample import data
```

## 🔄 Data Flow

### Read Products Flow
```
User clicks "Inventory"
    ↓
Login.tsx validates token
    ↓
Redirects to Inventory.tsx
    ↓
useEffect triggers fetchProducts()
    ↓
productsApi.getAll() called
    ↓
GET /api/products
    ↓
SQLite: SELECT * FROM products
    ↓
JSON response with products array
    ↓
React Query caches data
    ↓
ProductsTable renders rows
    ↓
User sees product list
```

### Update Product Flow
```
User clicks Edit button
    ↓
ProductsTable enters edit mode
    ↓
User changes stock value
    ↓
User clicks Save
    ↓
handleSave() called
    ↓
productsApi.update(id, data)
    ↓
PUT /api/products/:id
    ↓
Backend validates:
  - Name uniqueness
  - Stock >= 0
    ↓
SQLite: UPDATE products WHERE id = ?
    ↓
Get old stock value
    ↓
INSERT into inventory_logs
    ↓
Return updated product
    ↓
Optimistic UI update
    ↓
Toast success message
    ↓
Refresh product list
```

### CSV Import Flow
```
User clicks Import button
    ↓
File picker opens
    ↓
User selects CSV file
    ↓
handleImport() triggered
    ↓
FormData created with file
    ↓
POST /api/products/import
    ↓
Multer receives file
    ↓
CSV parsed to JSON
    ↓
For each product:
  - Check for duplicates
  - Validate required fields
  - Insert if new
    ↓
Return { added, skipped, duplicates }
    ↓
Display toast with summary
    ↓
Refresh product list
    ↓
Clean up temporary file
```

## 🗄️ Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  image TEXT
);

-- Indexes
CREATE UNIQUE INDEX idx_product_name ON products(name);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_product_status ON products(status);
```

### Inventory Logs Table
```sql
CREATE TABLE inventory_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId INTEGER NOT NULL,
  oldStock INTEGER NOT NULL,
  newStock INTEGER NOT NULL,
  changedBy TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id)
);

-- Indexes
CREATE INDEX idx_logs_product ON inventory_logs(productId);
CREATE INDEX idx_logs_timestamp ON inventory_logs(timestamp DESC);
```

## 🎨 Component Architecture

### Component Hierarchy
```
App
├── BrowserRouter
│   ├── Login                    # Authentication page
│   └── Inventory               # Main application
│       ├── Header              # Logo, title, logout
│       ├── Controls            # Search, filters, actions
│       │   ├── SearchBar
│       │   ├── CategoryFilter
│       │   ├── AddButton
│       │   ├── ImportButton
│       │   └── ExportButton
│       ├── ProductsTable       # Main data table
│       │   └── ProductRow      # Individual rows
│       │       ├── EditMode    # Inline editing
│       │       └── ViewMode    # Normal display
│       ├── InventoryHistory    # Sidebar panel
│       │   └── HistoryLog      # Individual log entries
│       └── AddProductDialog    # Modal form
│           └── ProductForm     # Add product form
```

### State Management

**Local State (useState)**
- Form inputs
- Edit mode toggles
- Dialog open/close
- Loading states

**Query State (React Query)**
- Products list
- Search results
- History logs

**Route State (React Router)**
- Authentication status
- Current page
- Navigation

**Persistent State (localStorage)**
- Auth token
- User information

## 🔌 API Design

### RESTful Principles
- **GET**: Retrieve data (idempotent)
- **POST**: Create new resources
- **PUT**: Update existing resources
- **DELETE**: Remove resources

### Response Formats

**Success Response**
```json
{
  "id": 1,
  "name": "Product Name",
  "stock": 100,
  ...
}
```

**Error Response**
```json
{
  "error": "Descriptive error message"
}
```

**Import Response**
```json
{
  "added": 5,
  "skipped": 2,
  "duplicates": [
    { "name": "Existing Product", "existingId": 3 }
  ]
}
```

## 🎯 Design Patterns

### Frontend Patterns

**1. Container/Presentation Pattern**
- Container: `Inventory.tsx` (logic)
- Presentation: `ProductsTable.tsx` (UI)

**2. Custom Hooks**
- `useIsMobile()` - Responsive detection
- `useToast()` - Toast notifications

**3. Higher-Order Components**
- `ProtectedRoute` - Authentication guard

**4. Composition Pattern**
- Dialog components
- Form components

### Backend Patterns

**1. MVC Architecture**
- Models: Database schemas
- Views: JSON responses
- Controllers: Route handlers

**2. Middleware Pattern**
- CORS middleware
- JSON body parser
- Multer file upload

**3. Repository Pattern**
- SQLite database abstraction
- Query builders

## 🔒 Security Measures

### Frontend
- ✅ XSS Prevention: React auto-escaping
- ✅ CSRF Protection: Token-based auth
- ✅ Input Validation: Form validation
- ✅ Secure Storage: HttpOnly (if cookies used)

### Backend
- ✅ SQL Injection: Parameterized queries
- ✅ CORS Configuration: Specific origins
- ✅ Input Validation: Server-side checks
- ✅ File Upload Limits: Multer limits
- ✅ Error Handling: No stack traces in production

### Authentication
- ✅ Password hashing (in production)
- ✅ Token-based authentication
- ✅ Session expiration
- ✅ Protected routes

## 🚀 Performance Optimizations

### Frontend
- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Images lazy load
- **Debouncing**: Search input debouncing
- **Memoization**: React.memo on components
- **Optimistic Updates**: Instant UI feedback

### Backend
- **Database Indexing**: On frequently queried fields
- **Connection Pooling**: SQLite connection reuse
- **Caching**: In-memory cache for static data
- **Pagination**: Ready for large datasets

### Build Optimizations
- **Minification**: Vite production build
- **Tree Shaking**: Unused code removal
- **Asset Optimization**: Image compression
- **Gzip Compression**: Server-level compression

## 📱 Responsive Design Strategy

### Breakpoints
```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

### Mobile-First Approach
1. Design for mobile (smallest screen)
2. Enhance for tablets (medium screens)
3. Optimize for desktop (large screens)

### Adaptive Components
- Navigation: Hamburger menu on mobile
- Table: Horizontal scroll on mobile
- Dialogs: Full-screen on mobile
- Sidebar: Slide-in on all sizes

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Function logic
- API client methods

### Integration Tests
- API endpoint testing
- Database operations
- CSV import/export

### E2E Tests
- User workflows
- Authentication flow
- CRUD operations

### Manual Testing Checklist
- [ ] All CRUD operations
- [ ] CSV import/export
- [ ] Search and filtering
- [ ] Inventory history
- [ ] Mobile responsiveness
- [ ] Error handling

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
1. **Trigger**: Push to main branch
2. **Lint**: ESLint checks
3. **Build**: Frontend production build
4. **Test**: Run test suite
5. **Deploy**: Auto-deploy to Netlify/Railway

### Deployment Process
- **Frontend**: Netlify auto-deploy
- **Backend**: Railway auto-deploy
- **Database**: Persisted on Railway

---

**Architecture Version**: 1.0.0
**Last Updated**: 2025
**Tech Stack**: React + TypeScript + Node.js + SQLite
