from datetime import datetime

from app.database import db


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity_available = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        stock_status = "Out of Stock" if self.quantity_available == 0 else "Low Stock" if self.quantity_available < 25 else "In Stock"
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "price": self.price,
            "inventory": self.quantity_available,
            "stockStatus": stock_status,
            "image": self.name[:2].upper(),
        }
