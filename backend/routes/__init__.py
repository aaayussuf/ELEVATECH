from flask import Flask


def init_routes(app: Flask):
    from .pages import pages_bp
    from .products import products_bp
    from .auth import auth_bp
    from .cart import cart_bp

    app.register_blueprint(pages_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(cart_bp)

