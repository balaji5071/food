const express = require('express');
const router = express.Router();

// ---------------------------------------------------------------------------
// In-memory storage (replace with a real database in production)
// ---------------------------------------------------------------------------
let orders = [];
let nextOrderNumber = 1;

// ---------------------------------------------------------------------------
// Allowed order statuses – whitelist
// ---------------------------------------------------------------------------
const VALID_STATUSES = ['Pending', 'Preparing', 'Ready'];

// ---------------------------------------------------------------------------
// Middleware: require API key for vendor-only routes
// Set VENDOR_API_KEY in your .env file to enable.
// ---------------------------------------------------------------------------
function requireVendorAuth(req, res, next) {
  const vendorKey = process.env.VENDOR_API_KEY;
  // If no key is configured, auth is disabled (development mode)
  if (!vendorKey) return next();

  const provided = req.headers['x-api-key'];
  if (!provided || provided !== vendorKey) {
    return res.status(401).json({ error: 'Unauthorized – invalid or missing API key' });
  }
  next();
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/** Validate a single order item object. Returns an error string or null. */
function validateItem(item, index) {
  if (typeof item !== 'object' || item === null) {
    return `items[${index}] must be an object`;
  }
  if (typeof item.name !== 'string' || item.name.trim().length === 0) {
    return `items[${index}].name must be a non-empty string`;
  }
  if (typeof item.price !== 'number' || item.price < 0) {
    return `items[${index}].price must be a non-negative number`;
  }
  if (!Number.isInteger(item.quantity) || item.quantity < 1) {
    return `items[${index}].quantity must be a positive integer`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Create new order (public – customers)
router.post('/', (req, res) => {
  try {
    const { items } = req.body;

    // --- Input validation ---------------------------------------------------
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array' });
    }

    const sanitizedItems = [];
    for (let i = 0; i < items.length; i++) {
      const err = validateItem(items[i], i);
      if (err) return res.status(400).json({ error: err });

      sanitizedItems.push({
        name: items[i].name.trim(),
        price: items[i].price,
        quantity: items[i].quantity,
      });
    }

    // Recalculate total server-side – never trust the client value
    const totalAmount = sanitizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = {
      _id: Date.now().toString(),
      orderNumber: nextOrderNumber++,
      items: sanitizedItems,
      totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    console.error('POST /api/orders error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders (vendor-only)
router.get('/', requireVendorAuth, (_req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    console.error('GET /api/orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by order number (public – customers check their own order)
router.get('/:orderNumber', (req, res) => {
  try {
    const orderNumber = parseInt(req.params.orderNumber, 10);
    if (Number.isNaN(orderNumber)) {
      return res.status(400).json({ error: 'orderNumber must be a valid integer' });
    }

    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('GET /api/orders/:orderNumber error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (vendor-only)
router.patch('/:orderNumber/status', requireVendorAuth, (req, res) => {
  try {
    const orderNumber = parseInt(req.params.orderNumber, 10);
    if (Number.isNaN(orderNumber)) {
      return res.status(400).json({ error: 'orderNumber must be a valid integer' });
    }

    const { status } = req.body;

    // Validate against whitelist
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    res.json(order);
  } catch (error) {
    console.error('PATCH /api/orders/:orderNumber/status error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
