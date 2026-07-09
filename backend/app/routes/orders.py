from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from app.database import db
from app.metrics.metrics import orders_created_total, orders_failed_total, orders_status_total, refresh_business_metrics
from app.models import Order, Product, User
from app.schemas import OrderCreateSchema, OrderUpdateSchema

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


@orders_bp.get("")
def list_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([order.to_dict() for order in orders])


@orders_bp.post("")
def create_order():
    schema = OrderCreateSchema()
    try:
        payload = schema.load(request.get_json() or {})
    except ValidationError as exc:
        orders_failed_total.labels(reason="validation_error").inc()
        return jsonify({"error": exc.messages}), 400

    user_id = payload["user_id"]
    product_id = payload["product_id"]
    quantity = payload.get("quantity", 1)

    user = User.query.get(user_id)
    product = Product.query.get(product_id)
    if not user:
        orders_failed_total.labels(reason="validation_error").inc()
        return jsonify({"error": "user not found"}), 404
    if not product:
        orders_failed_total.labels(reason="validation_error").inc()
        return jsonify({"error": "product not found"}), 404
    if quantity <= 0:
        orders_failed_total.labels(reason="validation_error").inc()
        return jsonify({"error": "quantity must be greater than zero"}), 400

    if product.quantity_available < quantity:
        orders_failed_total.labels(reason="stock_unavailable").inc()
        return jsonify({"error": "insufficient inventory"}), 409

    try:
        total = product.price * quantity
        product.quantity_available -= quantity
        order = Order(user_id=user.id, product_id=product.id, quantity=quantity, total_price=total, status="Pending")
        db.session.add(order)
        db.session.commit()
    except Exception:
        db.session.rollback()
        orders_failed_total.labels(reason="database_error").inc()
        return jsonify({"error": "unable to create order"}), 500

    orders_created_total.inc()
    orders_status_total.labels(status="Pending").inc()
    refresh_business_metrics()
    return jsonify(order.to_dict()), 201


@orders_bp.get("/<int:order_id>")
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify(order.to_dict())


@orders_bp.patch("/<int:order_id>/status")
def update_order_status(order_id):
    schema = OrderUpdateSchema()
    order = Order.query.get_or_404(order_id)
    try:
        payload = schema.load(request.get_json() or {})
    except ValidationError as exc:
        return jsonify({"error": exc.messages}), 400

    status = payload.get("status")
    if not status:
        return jsonify({"error": "status is required"}), 400

    order.status = status
    db.session.commit()
    orders_status_total.labels(status=status).inc()
    refresh_business_metrics()
    return jsonify(order.to_dict())


@orders_bp.patch("/<int:order_id>/cancel")
def cancel_order(order_id):
    order = Order.query.get_or_404(order_id)
    if order.status == "Cancelled":
        return jsonify({"error": "order already cancelled"}), 409

    order.status = "Cancelled"
    db.session.commit()
    orders_status_total.labels(status="Cancelled").inc()
    refresh_business_metrics()
    return jsonify(order.to_dict())
