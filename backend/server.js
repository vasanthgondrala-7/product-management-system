const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        unit TEXT NOT NULL,
        category TEXT NOT NULL,
        brand TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL,
        image TEXT
      )
    `);

    // Inventory logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS inventory_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        oldStock INTEGER NOT NULL,
        newStock INTEGER NOT NULL,
        changedBy TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);

    // Insert sample data if empty
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (!err && row.count === 0) {
        const sampleProducts = [
          { name: 'Laptop Pro 15', unit: 'pcs', category: 'Electronics', brand: 'TechBrand', stock: 45, status: 'In Stock', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
          { name: 'Wireless Mouse', unit: 'pcs', category: 'Electronics', brand: 'TechBrand', stock: 120, status: 'In Stock', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400' },
          { name: 'Office Chair', unit: 'pcs', category: 'Furniture', brand: 'ComfortFit', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' },
          { name: 'Desk Lamp', unit: 'pcs', category: 'Furniture', brand: 'LightCo', stock: 67, status: 'In Stock', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
          { name: 'Notebook A4', unit: 'pcs', category: 'Books', brand: 'PaperPro', stock: 234, status: 'In Stock', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400' },
          { name: 'Sports Water Bottle', unit: 'pcs', category: 'Sports', brand: 'HydroFit', stock: 89, status: 'In Stock', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' },
          { name: 'Running Shoes', unit: 'pairs', category: 'Sports', brand: 'RunFast', stock: 34, status: 'In Stock', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
          { name: 'Coffee Maker', unit: 'pcs', category: 'Electronics', brand: 'BrewMaster', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400' },
        ];

        const stmt = db.prepare('INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
        sampleProducts.forEach((product) => {
          stmt.run(product.name, product.unit, product.category, product.brand, product.stock, product.status, product.image);
        });
        stmt.finalize();
        console.log('Sample products inserted');
      }
    });
  });
}

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple authentication (in production, use proper auth with hashed passwords)
  if (username === 'admin' && password === 'admin123') {
    res.json({
      token: 'demo-token-' + Date.now(),
      user: { username: 'admin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Search products
app.get('/api/products/search', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name query parameter is required' });
  }

  db.all(
    'SELECT * FROM products WHERE LOWER(name) LIKE LOWER(?) ORDER BY id DESC',
    [`%${name}%`],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// Create product
app.post('/api/products', (req, res) => {
  const { name, unit, category, brand, stock, status, image } = req.body;

  if (!name || !unit || !category || !brand || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const finalStatus = stock > 0 ? 'In Stock' : 'Out of Stock';

  db.run(
    'INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, unit, category, brand, stock, finalStatus, image || ''],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'Product with this name already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
      } else {
        db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).json(row);
          }
        });
      }
    }
  );
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, unit, category, brand, stock, status, image } = req.body;

  if (!name || !unit || !category || !brand || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (stock < 0) {
    return res.status(400).json({ error: 'Stock must be greater than or equal to 0' });
  }

  const finalStatus = stock > 0 ? 'In Stock' : 'Out of Stock';

  // First, get the current stock to log the change
  db.get('SELECT stock FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const oldStock = row.stock;

    // Check if name is unique (except for the current product)
    db.get('SELECT id FROM products WHERE name = ? AND id != ?', [name, id], (err, duplicate) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (duplicate) {
        return res.status(400).json({ error: 'Product with this name already exists' });
      }

      // Update the product
      db.run(
        'UPDATE products SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, status = ?, image = ? WHERE id = ?',
        [name, unit, category, brand, stock, finalStatus, image || '', id],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            // Log the stock change if stock was updated
            if (oldStock !== stock) {
              db.run(
                'INSERT INTO inventory_logs (productId, oldStock, newStock, changedBy) VALUES (?, ?, ?, ?)',
                [id, oldStock, stock, 'admin'],
                (logErr) => {
                  if (logErr) {
                    console.error('Failed to log stock change:', logErr);
                  }
                }
              );
            }

            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
              if (err) {
                res.status(500).json({ error: err.message });
              } else {
                res.json(row);
              }
            });
          }
        }
      );
    });
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      // Also delete related logs
      db.run('DELETE FROM inventory_logs WHERE productId = ?', [id]);
      res.json({ message: 'Product deleted successfully' });
    }
  });
});

// Get product history
app.get('/api/products/:id/history', (req, res) => {
  const { id } = req.params;

  db.all(
    'SELECT * FROM inventory_logs WHERE productId = ? ORDER BY timestamp DESC',
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// Import CSV
app.post('/api/products/import', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let added = 0;
    let skipped = 0;
    const duplicates = [];

    records.forEach((record) => {
      const { name, unit, category, brand, stock, status, image } = record;
      
      if (!name || !unit || !category || !brand || stock === undefined) {
        skipped++;
        return;
      }

      const finalStock = parseInt(stock) || 0;
      const finalStatus = finalStock > 0 ? 'In Stock' : 'Out of Stock';

      // Check for duplicates
      db.get('SELECT id, name FROM products WHERE LOWER(name) = LOWER(?)', [name], (err, row) => {
        if (row) {
          duplicates.push({ name, existingId: row.id });
          skipped++;
        } else {
          db.run(
            'INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, unit, category, brand, finalStock, finalStatus, image || ''],
            (err) => {
              if (err) {
                console.error('Error inserting product:', err);
                skipped++;
              } else {
                added++;
              }
            }
          );
        }
      });
    });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Wait a bit for all database operations to complete
    setTimeout(() => {
      res.json({ added, skipped, duplicates });
    }, 500);
  } catch (error) {
    console.error('Import error:', error);
    fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Failed to parse CSV file' });
  }
});

// Export CSV
app.get('/api/products/export', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      try {
        const csv = stringify(rows, {
          header: true,
          columns: ['id', 'name', 'unit', 'category', 'brand', 'stock', 'status', 'image']
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
        res.send(csv);
      } catch (error) {
        res.status(500).json({ error: 'Failed to generate CSV' });
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
