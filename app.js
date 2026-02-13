const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory database (for demonstration)
let products = [
  { id: 1, name: 'Laptop', price: 50000, stock: 10 },
  { id: 2, name: 'Phone', price: 25000, stock: 20 },
  { id: 3, name: 'Headphones', price: 5000, stock: 50 }
];

// ==================== ENDPOINTS ====================

// 1. Health Check - Verify microservice is running
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Microservice is running',
    timestamp: new Date(),
    service: 'Product Management Service'
  });
});

// 2. GET all products
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products,
    count: products.length
  });
});

// 3. GET product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// 4. CREATE new product
app.post('/api/products', (req, res) => {
  const { name, price, stock } = req.body;
  
  // Validation
  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name, price, and stock'
    });
  }
  
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    price,
    stock
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});

// 5. UPDATE product
app.put('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  const { name, price, stock } = req.body;
  
  if (name) product.name = name;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

// 6. DELETE product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  const deletedProduct = products.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct[0]
  });
});

// 7. GET products by price range
app.get('/api/products/price/:minPrice/:maxPrice', (req, res) => {
  const { minPrice, maxPrice } = req.params;
  
  const filtered = products.filter(p => 
    p.price >= parseInt(minPrice) && p.price <= parseInt(maxPrice)
  );
  
  res.json({
    success: true,
    priceRange: { minPrice, maxPrice },
    data: filtered,
    count: filtered.length
  });
});

// Error handling for 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 Scalable Microservice Started');
  console.log('========================================');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log('========================================\n');
});
