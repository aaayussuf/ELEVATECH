def test_home(client):
    response = client.get("/")
    assert response.status_code == 200

    data = response.get_json()
    assert data["message"] == "Welcome to ELEVATECH API"


def test_products_endpoint(client):
    response = client.get("/api/products")

    assert response.status_code == 200

    data = response.get_json()

    assert "products" in data
    assert "page" in data
    assert "pages" in data
