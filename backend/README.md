# Street Food Ordering System - Backend

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install and start MongoDB:**
   - Make sure MongoDB is installed on your system
   - Start MongoDB service:
     ```bash
     sudo systemctl start mongod
     ```

3. **Run the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Create Order
- **POST** `/api/orders`
- Body: 
  ```json
  {
    "items": [
      {"name": "Vada Pav", "price": 20, "quantity": 2}
    ],
    "totalAmount": 40
  }
  ```

### Get All Orders
- **GET** `/api/orders`

### Get Order by Number
- **GET** `/api/orders/:orderNumber`

### Update Order Status
- **PATCH** `/api/orders/:orderNumber/status`
- Body:
  ```json
  {
    "status": "Preparing"
  }
  ```

Status values: `Pending`, `Preparing`, `Ready`
