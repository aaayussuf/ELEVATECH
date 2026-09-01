def test_products_invalid_page_does_not_crash(client):
    response = client.get("/api/products?page=abc")

    assert response.status_code in (200, 400)


def test_products_invalid_per_page_does_not_crash(client):
    response = client.get("/api/products?per_page=abc")

    assert response.status_code in (200, 400)


def test_products_negative_page_does_not_crash(client):
    response = client.get("/api/products?page=-1")

    assert response.status_code in (200, 400)


def test_products_negative_per_page_does_not_crash(client):
    response = client.get("/api/products?per_page=-1")

    assert response.status_code in (200, 400)


def test_products_invalid_min_price_does_not_crash(client):
    response = client.get("/api/products?min_price=abc")

    assert response.status_code in (200, 400)


def test_products_invalid_max_price_does_not_crash(client):
    response = client.get("/api/products?max_price=abc")

    assert response.status_code in (200, 400)


def test_products_empty_search_does_not_crash(client):
    response = client.get("/api/products?search=")

    assert response.status_code == 200


def test_products_special_search_input_does_not_crash(client):
    response = client.get(
        "/api/products?search=%27%22%3C%3E%26"
    )

    assert response.status_code == 200


def test_products_large_page_number_does_not_crash(client):
    response = client.get("/api/products?page=999999")

    assert response.status_code == 200

    data = response.get_json()

    assert "products" in data
    assert "page" in data
    assert "pages" in data
