from app.extensions import db
from app.models import Category, Product


def seed_database():
    """Seed the database with initial categories and at least 10 products."""

    # ---- Categories (create if missing) ----
    category_specs = [
        {
            "name": "Laptops",
            "description": "Premium laptops for work and entertainment.",
            "image": "/assets/products/brands/laptops.png",
        },
        {
            "name": "Printers",
            "description": "Home and office printing solutions.",
            "image": "/assets/products/brands/printers.png",
        },
        {
            "name": "Phones",
            "description": "Smartphones for everyday performance.",
            "image": "/assets/products/brands/phones.png",
        },
        {
            "name": "Accessories",
            "description": "Keyboards, mice, and other productivity accessories.",
            "image": "/assets/products/brands/accessories.png",
        },
    ]

    for spec in category_specs:
        category = Category.query.filter_by(name=spec["name"]).first()
        if not category:
            category = Category(
                name=spec["name"],
                description=spec["description"],
                image=spec["image"],
            )
            db.session.add(category)

    db.session.commit()

    # ---- Products (at least 10) ----
    # Note: explicit IDs are requested; if your DB/model uses autoincrement
    # and the BaseModel primary key is an integer, these should work.
    products = [
        {
            "id": 1,
            "name": "MacBook Pro M4",
            "description": "Apple MacBook Pro with M4 chip for blazing-fast performance and battery life.",
            "image": "/assets/products/macbook-pro-m4.png",
            "price": 1999.0,
            "category": "Laptops",
            "brand": "Apple",
            "featured": True,
            "quantity": 20,
        },
        {
            "id": 2,
            "name": "Dell XPS 15",
            "description": "A premium 15-inch ultrabook with stunning display and powerful performance.",
            "image": "/assets/products/dell-xps-15.png",
            "price": 1599.0,
            "category": "Laptops",
            "brand": "Dell",
            "featured": False,
            "quantity": 15,
        },
        {
            "id": 3,
            "name": "HP EliteBook",
            "description": "Business-ready EliteBook with dependable build quality and security features.",
            "image": "/assets/products/hp-elitebook.png",
            "price": 1299.0,
            "category": "Laptops",
            "brand": "HP",
            "featured": False,
            "quantity": 18,
        },
        {
            "id": 4,
            "name": "Lenovo ThinkPad X1",
            "description": "Legendary ThinkPad reliability with a sleek design and productivity-focused keyboard.",
            "image": "/assets/products/lenovo-thinkpad-x1.png",
            "price": 1799.0,
            "category": "Laptops",
            "brand": "Lenovo",
            "featured": True,
            "quantity": 12,
        },
        {
            "id": 5,
            "name": "Canon Printer",
            "description": "Efficient Canon printer for crisp documents and consistent everyday output.",
            "image": "/assets/products/canon-printer.png",
            "price": 199.99,
            "category": "Printers",
            "brand": "Canon",
            "featured": False,
            "quantity": 30,
        },
        {
            "id": 6,
            "name": "HP LaserJet",
            "description": "Fast, sharp laser printing built for small offices and reliable day-to-day work.",
            "image": "/assets/products/hp-laserjet.png",
            "price": 249.99,
            "category": "Printers",
            "brand": "HP",
            "featured": True,
            "quantity": 25,
        },
        {
            "id": 7,
            "name": "iPhone 17",
            "description": "Latest iPhone experience with advanced performance, camera features, and smooth performance.",
            "image": "/assets/products/iphone-17.png",
            "price": 1099.0,
            "category": "Phones",
            "brand": "Apple",
            "featured": True,
            "quantity": 22,
        },
        {
            "id": 8,
            "name": "Samsung S26",
            "description": "A flagship Samsung phone with a brilliant display and top-tier hardware.",
            "image": "/assets/products/samsung-s26.png",
            "price": 999.0,
            "category": "Phones",
            "brand": "Samsung",
            "featured": False,
            "quantity": 28,
        },
        {
            "id": 9,
            "name": "Gaming Keyboard",
            "description": "Mechanical-feel gaming keyboard with customizable keys and responsive actuation.",
            "image": "/assets/products/gaming-keyboard.png",
            "price": 79.99,
            "category": "Accessories",
            "brand": "HyperKeys",
            "featured": True,
            "quantity": 40,
        },
        {
            "id": 10,
            "name": "Wireless Mouse",
            "description": "Comfortable wireless mouse with precise tracking and long battery life.",
            "image": "/assets/products/wireless-mouse.png",
            "price": 29.99,
            "category": "Accessories",
            "brand": "TechGrip",
            "featured": False,
            "quantity": 60,
        },
    ]

    def slugify(name: str) -> str:
        return "".join(ch.lower() if ch.isalnum() else "-" for ch in name).strip("-")

    for item in products:
        # idempotency by name
        existing = Product.query.filter_by(name=item["name"]).first()
        if existing:
            continue

        category = Category.query.filter_by(name=item["category"]).first()
        if not category:
            # should not happen because we create categories above
            continue

        product = Product(
            id=item["id"],
            name=item["name"],
            slug=slugify(item["name"]),
            description=item["description"],
            price=item["price"],
            quantity=item.get("quantity", 0),
            image=item["image"],
            brand=item.get("brand"),
            featured=bool(item.get("featured", False)),
            category_id=category.id,
        )
        db.session.add(product)

    db.session.commit()
    print("Database seed completed.")

