from app.extensions import db
from app.models.supplier import Supplier


def get_suppliers():
    return (
        Supplier.query
        .order_by(Supplier.company_name.asc())
        .all()
    )


def get_supplier(supplier_id):
    return Supplier.query.get(supplier_id)


def create_supplier(data):
    supplier = Supplier(
        company_name=data["company_name"],
        contact_name=data.get("contact_name"),
        email=data.get("email"),
        phone=data.get("phone"),
        address=data.get("address"),
        notes=data.get("notes"),
        active=data.get("active", True),
    )

    db.session.add(supplier)
    db.session.commit()

    return supplier


def update_supplier(supplier_id, data):
    supplier = Supplier.query.get(supplier_id)

    if not supplier:
        return None

    for key, value in data.items():
        if hasattr(supplier, key):
            setattr(supplier, key, value)

    db.session.commit()

    return supplier


def delete_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)

    if not supplier:
        return False

    db.session.delete(supplier)
    db.session.commit()

    return True
