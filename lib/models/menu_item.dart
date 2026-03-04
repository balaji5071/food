class MenuItem {
  final String name;
  final double price;
  final String description;

  MenuItem({
    required this.name,
    required this.price,
    required this.description,
  });
}

// Static menu data
class MenuData {
  static final List<MenuItem> menuItems = [
    MenuItem(
      name: 'Vada Pav',
      price: 20.0,
      description: 'Classic Mumbai street food',
    ),
    MenuItem(
      name: 'Pav Bhaji',
      price: 60.0,
      description: 'Mixed vegetables with butter pav',
    ),
    MenuItem(
      name: 'Dosa',
      price: 50.0,
      description: 'Crispy South Indian crepe',
    ),
    MenuItem(
      name: 'Samosa',
      price: 15.0,
      description: 'Crispy fried pastry with potato filling',
    ),
    MenuItem(
      name: 'Chai',
      price: 10.0,
      description: 'Indian spiced tea',
    ),
    MenuItem(
      name: 'Bhel Puri',
      price: 30.0,
      description: 'Puffed rice with tangy chutney',
    ),
  ];
}
