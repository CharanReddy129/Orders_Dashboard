from app.database import db
from app.models import Order, Product, User
from app.metrics.metrics import orders_status_total, refresh_business_metrics


def seed_database():
    if User.query.first() is None:
        users = [
            User(name="Ava Thompson", email="ava@example.com", role="Admin", status="Active"),
            User(name="Noah Patel", email="noah@example.com", role="Manager", status="Active"),
            User(name="Mia Chen", email="mia@example.com", role="Customer", status="Invited"),
            User(name="Liam Brooks", email="liam@example.com", role="Customer", status="Active"),
            User(name="Sophia Khan", email="sophia@example.com", role="Manager", status="Suspended"),
        ]
        db.session.add_all(users)

    if Product.query.first() is None:
        products = [
            Product(name="Aero Knit Hoodie", category="Apparel", price=89.0, quantity_available=128),
            Product(name="Orbit Desk Lamp", category="Home", price=142.0, quantity_available=21),
            Product(name="Pulse Fitness Band", category="Electronics", price=129.0, quantity_available=0),
            Product(name="Ceramic Pour Set", category="Kitchen", price=74.0, quantity_available=58),
            Product(name="Nomad Travel Pack", category="Bags", price=189.0, quantity_available=14),
        ]
        db.session.add_all(products)

    if Order.query.first() is None:
        sample_orders = [
            Order(user_id=1, product_id=1, quantity=2, total_price=178.0, status="Completed"),
            Order(user_id=2, product_id=2, quantity=1, total_price=142.0, status="Pending"),
            Order(user_id=3, product_id=3, quantity=1, total_price=129.0, status="Failed"),
            Order(user_id=4, product_id=4, quantity=3, total_price=222.0, status="Completed"),
            Order(user_id=2, product_id=5, quantity=2, total_price=378.0, status="Pending"),
            Order(user_id=5, product_id=1, quantity=1, total_price=89.0, status="Cancelled"),
            Order(user_id=3, product_id=4, quantity=2, total_price=148.0, status="Completed"),
            Order(user_id=1, product_id=2, quantity=1, total_price=142.0, status="Pending"),
        ]
        db.session.add_all(sample_orders)

    if db.session.new or db.session.dirty:
        db.session.commit()

    refresh_business_metrics()
    for status in ["Pending", "Completed", "Cancelled", "Failed"]:
        orders_status_total.labels(status=status).inc(0)
