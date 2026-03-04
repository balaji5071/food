# Street Food Ordering System

A lightweight digital ordering and queue management system for street-food vendors built with Flutter and Node.js.

## Project Overview

This app helps popular street-food vendors manage orders efficiently during rush hours, reducing long queues and order confusion. It supports two modes:
- **Customer Mode**: Browse menu, place orders, track order status
- **Vendor Mode**: View and manage incoming orders in real-time

## Features

### Customer Features
- View menu with prices and descriptions
- Add items to cart with quantity selection
- Place orders and receive order number
- Track order status in real-time (Pending → Preparing → Ready)

### Vendor Features
- View all incoming orders in FIFO order
- See order details (items, quantities, total amount)
- Update order status with simple buttons
- Auto-refresh to show new orders

## Tech Stack

### Frontend (Flutter)
- **Framework**: Flutter 3.x
- **Language**: Dart
- **HTTP Client**: http package
- **UI**: Material Design 3

### Backend (Node.js)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose

## Project Structure

```
test_app/
├── lib/
│   ├── main.dart                          # App entry point
│   ├── models/
│   │   ├── menu_item.dart                 # Menu item model with static data
│   │   └── order.dart                     # Order and OrderItem models
│   ├── services/
│   │   └── api_service.dart               # REST API client
│   └── screens/
│       ├── role_selection_screen.dart     # Customer/Vendor selection
│       ├── customer/
│       │   ├── menu_screen.dart           # Browse and add items to cart
│       │   ├── cart_screen.dart           # Review cart and place order
│       │   └── order_status_screen.dart   # Track order status
│       └── vendor/
│           └── order_management_screen.dart  # Manage all orders
└── backend/
    ├── server.js                          # Express server setup
    ├── models/
    │   └── Order.js                       # MongoDB Order schema
    └── routes/
        └── orders.js                      # Order API endpoints
```

## Setup Instructions

### Prerequisites
- Flutter SDK (3.x or higher)
- Node.js (16.x or higher)
- MongoDB (5.x or higher)

### Backend Setup

1. **Install MongoDB and start the service:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod  # Optional: start on boot
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm start
   # OR for development with auto-reload:
   npm run dev
   ```

   The server will run on `http://localhost:3000`

### Frontend Setup

1. **Get Flutter dependencies:**
   ```bash
   flutter pub get
   ```

2. **Update API URL (if needed):**
   - Open `lib/services/api_service.dart`
   - Update `baseUrl`:
     - For Android Emulator: `http://10.0.2.2:3000/api`
     - For iOS Simulator: `http://localhost:3000/api`
     - For Physical Device: `http://YOUR_LOCAL_IP:3000/api`

3. **Run the Flutter app:**
   ```bash
   flutter run
   # Or select a specific device:
   flutter run -d chrome        # Web
   flutter run -d linux         # Linux Desktop
   flutter run -d android       # Android
   ```

## API Endpoints

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "items": [
    {"name": "Vada Pav", "price": 20, "quantity": 2}
  ],
  "totalAmount": 40
}
```

### Get All Orders
```http
GET /api/orders
```

### Get Order by Number
```http
GET /api/orders/:orderNumber
```

### Update Order Status
```http
PATCH /api/orders/:orderNumber/status
Content-Type: application/json

{
  "status": "Preparing"
}
```

**Status values**: `Pending`, `Preparing`, `Ready`

## Usage Flow

1. **Launch the app** → Choose role (Customer or Vendor)

2. **Customer Flow:**
   - Browse menu
   - Add items to cart
   - Place order
   - Get order number
   - Track status in real-time

3. **Vendor Flow:**
   - View all orders
   - Click "Start Preparing" for pending orders
   - Click "Mark as Ready" when order is complete
   - Orders auto-refresh every 3 seconds

## Key Design Decisions

- **No Authentication**: Simple role selection for MVP
- **Static Menu**: Menu items are hardcoded in the app
- **Polling**: Auto-refresh every 3 seconds for real-time updates
- **FIFO Order Display**: Orders shown in chronological order
- **Simple Status Flow**: Pending → Preparing → Ready (one-way)

## Future Enhancements

- QR code-based ordering
- Payment integration
- Vendor analytics dashboard
- Push notifications for order updates
- Multiple vendor support
- Order history
- User authentication

## Development Notes

This is an MVP designed for:
- Easy understanding and explanation in interviews
- Clean, maintainable code structure
- Real-world problem solving
- Scalable architecture for future features

## Troubleshooting

**Backend won't start:**
- Check if MongoDB is running: `sudo systemctl status mongod`
- Verify port 3000 is not in use: `lsof -i :3000`

**Flutter can't connect to backend:**
- Check `baseUrl` in `api_service.dart`
- Ensure backend is running
- For physical devices, use your local IP address

**Orders not updating:**
- Check browser console / app logs for API errors
- Verify MongoDB connection in backend logs

## License

This project is created for educational and portfolio purposes.
