from extensions import db
from app.models import User, Category, Product
# from .app import create_app



def seed_db_if_empty():
    # Called inside app_context by app.py
    # If tables don't exist yet, create them before checking emptiness.
    db.create_all()

    if User.query.first():
        return

    # Create default admin/user
    admin = User(email='admin@bxtech.com', role='admin')
    admin.set_password('admin123')
    user = User(email='user@bxtech.com', role='customer')
    user.set_password('user123')
    db.session.add_all([admin, user])

    # Categories
    categories = [
        ('Laptops', 'laptops'),
        ('Printers', 'printers'),
        ('Scanners', 'scanners'),
        ('Mobile Phones', 'phones'),
        ('Accessories', 'accessories'),
        ('Band', 'band'),
    ]
    cat_objs = []
    for name, slug in categories:
        cat = Category(name=name, slug=slug)
        cat_objs.append(cat)
        db.session.add(cat)

    db.session.flush()

    # Products (demo)
    demo_products = [
        ('EXUK Laptop 14"', 'exuk-laptop-14', 650, 'USD', 12, 'A reliable office laptop.', 'laptops'),
        ('BX Band Sport', 'bx-band-sport', 35, 'USD', 200, 'Fitness band for daily tracking.', 'band'),
        ('EXUK Printer Pro', 'exuk-printer-pro', 120, 'USD', 40, 'Fast printing for home & office.', 'printers'),
        ('ScanJet 3000', 'scanjet-3000', 85, 'USD', 60, 'Sharp scans for documents.', 'scanners'),
        ('Mobile Phone X', 'mobile-phone-x', 220, 'USD', 25, 'Smooth performance and cameras.', 'phones'),
        ('Laptop Dock USB-C', 'laptop-dock-usbc', 25, 'USD', 120, 'Expand connectivity with one dock.', 'accessories'),
    ]

    cat_by_slug = {c.slug: c for c in cat_objs}

    for name, slug, price, currency, stock, desc, cat_slug in demo_products:
        p = Product(
            name=name,
            slug=slug,
            price=price,
            currency=currency,
            stock=stock,
            description=desc,
            imageUrl=None,
            category_id=cat_by_slug[cat_slug].id,
        )
        db.session.add(p)

    db.session.commit()

