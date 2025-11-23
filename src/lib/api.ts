// API configuration and helper functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface Product {
  id: number;
  name: string;
  unit: string;
  category: string;
  brand: string;
  stock: number;
  status: 'In Stock' | 'Out of Stock';
  image: string;
}

export interface InventoryLog {
  id: number;
  productId: number;
  oldStock: number;
  newStock: number;
  changedBy: string;
  timestamp: string;
}

export interface ImportResponse {
  added: number;
  skipped: number;
  duplicates: Array<{ name: string; existingId: number }>;
}

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  search: async (name: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/search?name=${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error('Failed to search products');
    return response.json();
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update product');
    }
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },

  importCSV: async (file: File): Promise<ImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/products/import`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to import CSV');
    return response.json();
  },

  exportCSV: async (): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/products/export`);
    if (!response.ok) throw new Error('Failed to export CSV');
    return response.blob();
  },

  getHistory: async (id: number): Promise<InventoryLog[]> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/history`);
    if (!response.ok) throw new Error('Failed to fetch product history');
    return response.json();
  },
};

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<{ token: string; user: { username: string } }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },
};
