const express = require('express');
const router = express.Router();

// In-memory storage (replace with MongoDB later)
let orders = [];
let nextOrderNumber = 1;

// Create new order
router.post('/', (req, res) => {
  try {
    const order = {
      _id: Date.now().toString(),
      orderNumber: nextOrderNumber++,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
router.get('/', (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by order number
router.get('/:orderNumber', (req, res) => {
  try {
    const order = orders.find(o => o.orderNumber === parseInt(req.params.orderNumber));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/:orderNumber/status', (req, res) => {
  try 
  {
    const order = orders.find(o => o.orderNumber === parseInt(req.params.orderNumber));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
              }

    order.status = req.body.status;
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
