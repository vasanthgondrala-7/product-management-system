# Inventory Management Backend

Node.js + Express + SQLite backend for the Inventory Management System.

## Features

- RESTful API for product management
- CSV import/export functionality
- Inventory history tracking
- SQLite database
- Basic authentication

## Setup Instructions

### Prerequisites

- Node.js 14+ installed
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (username: admin, password: admin123)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search?name=<query>` - Search products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/:id/history` - Get inventory history

### Import/Export
- `POST /api/products/import` - Import products from CSV
- `GET /api/products/export` - Export products to CSV

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Products Table
- `id` - Auto-increment primary key
- `name` - Unique product name
- `unit` - Unit of measurement
- `category` - Product category
- `brand` - Brand name
- `stock` - Current stock quantity
- `status` - 'In Stock' or 'Out of Stock'
- `image` - Image URL

### Inventory Logs Table
- `id` - Auto-increment primary key
- `productId` - Foreign key to products
- `oldStock` - Previous stock quantity
- `newStock` - New stock quantity
- `changedBy` - User who made the change
- `timestamp` - Date and time of change

## CSV Format

For imports, use the following CSV format:
```csv
name,unit,category,brand,stock,status,image
Product Name,pcs,Category,Brand,100,In Stock,https://example.com/image.jpg
```

## Deployment to Railway

1. Create a Railway account at https://railway.app
2. Create a new project
3. Connect your GitHub repository
4. Add the backend directory as the root path
5. Railway will auto-detect Node.js and deploy

Environment variables needed:
- `PORT` - Will be set automatically by Railway

## Testing

Use the demo credentials:
- Username: `admin`
- Password: `admin123`

## License

ISC
