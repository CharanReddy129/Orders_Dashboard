from datetime import datetime

from app.database import db


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(32), default="Pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", lazy="joined")
    product = db.relationship("Product", lazy="joined")

    def to_dict(self):
        return {
            "id": self.id,
            "customer": self.user.name if self.user else f"Customer {self.user_id}",
            "email": self.user.email if self.user else f"customer{self.user_id}@example.com",
            "product": self.product.name if self.product else f"Product {self.product_id}",
            "total": self.total_price,
            "status": self.status,
            "createdAt": self.created_at.strftime("%Y-%m-%d"),
        }
