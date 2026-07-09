from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from app.database import db
from app.metrics.metrics import refresh_business_metrics
from app.models import Order, Product
from app.schemas import ProductCreateSchema, ProductUpdateSchema

products_bp = Blueprint("products", __name__, url_prefix="/api/products")


@products_bp.get("")
def list_products():
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([product.to_dict() for product in products])


def _normalize_product_payload(payload):
    if "inventory" in payload and "quantity_available" not in payload:
        payload["quantity_available"] = payload["inventory"]
    payload.pop("inventory", None)
    return payload


@products_bp.post("")
def create_product():
    schema = ProductCreateSchema()
    try:
        payload = schema.load(request.get_json() or {})
    except ValidationError as exc:
        return jsonify({"error": exc.messages}), 400

    payload = _normalize_product_payload(payload)
    if "quantity_available" not in payload:
        payload["quantity_available"] = 0

    product = Product(**payload)
    db.session.add(product)
    db.session.commit()
    refresh_business_metrics()
    return jsonify(product.to_dict()), 201


@products_bp.get("/<int:product_id>")
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())


@products_bp.put("/<int:product_id>")
def update_product(product_id):
    schema = ProductUpdateSchema()
    product = Product.query.get_or_404(product_id)
    try:
        payload = schema.load(request.get_json() or {})
    except ValidationError as exc:
        return jsonify({"error": exc.messages}), 400

    payload = _normalize_product_payload(payload)

    for key, value in payload.items():
        setattr(product, key, value)
    db.session.commit()
    refresh_business_metrics()
    return jsonify(product.to_dict())


@products_bp.delete("/<int:product_id>")
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    Order.query.filter(Order.product_id == product.id).delete(synchronize_session=False)
    db.session.delete(product)
    db.session.commit()
    refresh_business_metrics()
    return jsonify({"deleted": True})
