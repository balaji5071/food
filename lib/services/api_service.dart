import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/order.dart';

class ApiService {
  // Change this to your local IP address when testing on physical device
  // For Android emulator, use 10.0.2.2
  // For iOS simulator, use localhost
  static const String baseUrl = 'http://localhost:3000/api';

  // Create a new order
  Future<Order> createOrder(List<OrderItem> items, double totalAmount) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/orders'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'items': items.map((item) => item.toJson()).toList(),
          'totalAmount': totalAmount,
        }),
      );

      if (response.statusCode == 201) {
        return Order.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to create order: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error creating order: $e');
    }
  }

  // Get all orders
  Future<List<Order>> getAllOrders() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/orders'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        List<dynamic> ordersJson = jsonDecode(response.body);
        return ordersJson.map((json) => Order.fromJson(json)).toList();
      } else {
        throw Exception('Failed to fetch orders: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error fetching orders: $e');
    }
  }

  // Get order by order number
  Future<Order> getOrderByNumber(int orderNumber) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/orders/$orderNumber'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return Order.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to fetch order: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error fetching order: $e');
    }
  }

  // Update order status
  Future<Order> updateOrderStatus(int orderNumber, String status) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/orders/$orderNumber/status'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'status': status}),
      );

      if (response.statusCode == 200) {
        return Order.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to update order: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error updating order: $e');
    }
  }
}
