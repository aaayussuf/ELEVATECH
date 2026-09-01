from app.extensions import db
from app.models.product import Product
from app.models.category import Category


def create_category(name="Test Category"):
    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    return category


def create_product(
    category,
    name="Test Product",
    slug="test-product",
    price=1000,
    brand="TestBrand",
    featured=False,
    active=True,
    quantity=10,
):
    product = Product(
        name=name,
        slug=slug,
        description=f"{name} description",
        short_description=f"{name} short description",
        price=price,
        brand=brand,
        featured=featured,
        active=active,
        quantity=quantity,
        category_id=category.id,
    )

    db.session.add(product)
    db.session.commit()

    return product


def test_products_returns_products(client):
    category = create_category()

    create_product(
        category,
        name="Laptop",
        slug="laptop",
        price=50000,
    )

    response = client.get("/api/products")

    assert response.status_code == 200

    data = response.get_json()

    assert "products" in data
    assert data["total"] >= 1
    assert any(p["name"] == "Laptop" for p in data["products"])


def test_products_search(client):
    category = create_category()

    create_product(
        category,
        name="HP Laptop",
        slug="hp-laptop",
        price=50000,
    )

    create_product(
        category,
        name="Samsung Phone",
        slug="samsung-phone",
        price=30000,
    )

    response = client.get(
        "/api/products?search=HP"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert any(p["name"] == "HP Laptop" for p in data["products"])
    assert not any(p["name"] == "Samsung Phone" for p in data["products"])


def test_products_filter_by_brand(client):
    category = create_category()

    create_product(
        category,
        name="HP Laptop",
        slug="hp-laptop",
        price=50000,
        brand="HP",
    )

    create_product(
        category,
        name="Dell Laptop",
        slug="dell-laptop",
        price=55000,
        brand="Dell",
    )

    response = client.get(
        "/api/products?brand=HP"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert all(
        product["brand"] == "HP"
        for product in data["products"]
    )


def test_products_filter_by_price(client):
    category = create_category()

    create_product(
        category,
        name="Cheap Product",
        slug="cheap-product",
        price=500,
    )

    create_product(
        category,
        name="Expensive Product",
        slug="expensive-product",
        price=5000,
    )

    response = client.get(
        "/api/products?min_price=1000&max_price=6000"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert any(
        p["name"] == "Expensive Product"
        for p in data["products"]
    )

    assert not any(
        p["name"] == "Cheap Product"
        for p in data["products"]
    )


def test_featured_products(client):
    category = create_category()

    create_product(
        category,
        name="Featured Product",
        slug="featured-product",
        price=1000,
        featured=True,
    )

    create_product(
        category,
        name="Normal Product",
        slug="normal-product",
        price=1000,
        featured=False,
    )

    response = client.get(
        "/api/products?featured=true"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert all(
        product["featured"] is True
        for product in data["products"]
    )


def test_inactive_products_are_hidden(client):
    category = create_category()

    create_product(
        category,
        name="Inactive Product",
        slug="inactive-product",
        price=1000,
        active=False,
    )

    response = client.get("/api/products")

    assert response.status_code == 200

    data = response.get_json()

    assert not any(
        product["name"] == "Inactive Product"
        for product in data["products"]
    )


def test_product_details(client):
    category = create_category()

    product = create_product(
        category,
        name="Product Details Test",
        slug="product-details-test",
        price=2500,
    )

    response = client.get(
        f"/api/products/{product.slug}"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["name"] == "Product Details Test"
    assert data["slug"] == "product-details-test"
    assert data["price"] == 2500


def test_product_details_not_found(client):
    response = client.get(
        "/api/products/product-that-does-not-exist"
    )

    assert response.status_code == 404


def test_featured_endpoint(client):
    category = create_category()

    create_product(
        category,
        name="Featured One",
        slug="featured-one",
        price=1000,
        featured=True,
    )

    response = client.get(
        "/api/products/featured"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert isinstance(data, list)
    assert any(
        product["name"] == "Featured One"
        for product in data
    )


def test_latest_endpoint(client):
    category = create_category()

    create_product(
        category,
        name="Latest Product",
        slug="latest-product",
        price=1000,
    )

    response = client.get(
        "/api/products/latest"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert isinstance(data, list)
    assert any(
        product["name"] == "Latest Product"
        for product in data
    )


def test_related_products(client):
    category = create_category()

    main_product = create_product(
        category,
        name="Main Product",
        slug="main-product",
        price=1000,
    )

    related = create_product(
        category,
        name="Related Product",
        slug="related-product",
        price=1200,
    )

    response = client.get(
        f"/api/products/related/{main_product.id}"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert isinstance(data, list)

    assert any(
        product["id"] == related.id
        for product in data
    )

    assert not any(
        product["id"] == main_product.id
        for product in data
    )
