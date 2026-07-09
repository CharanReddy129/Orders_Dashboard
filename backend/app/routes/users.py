from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from sqlalchemy.exc import IntegrityError

from app.database import db
from app.metrics.metrics import active_users, orders_failed_total, orders_status_total, refresh_business_metrics
from app.models import Order, User
from app.schemas import UserCreateSchema, UserUpdateSchema

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.get("")
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([user.to_dict() for user in users])


@users_bp.post("")
def create_user():
    schema = UserCreateSchema()
    try:
        payload = schema.load(request.get_json() or {})
    except ValidationError as exc:
        orders_failed_total.labels(reason="validation_error").inc()
        return jsonify({"error": exc.messages}), 400

    user = User(**payload)
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "email already exists"}), 409

    refresh_business_metrics()
    return jsonify(user.to_dict()), 201


@users_bp.get("/<int:user_id>")
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())


@users_bp.put("/<int:user_id>")
def update_user(user_id):
    schema = UserUpdateSchema()
    user = User.query.get_or_404(user_id)
    try:
        payload = schema.load(request.get_json() or {})
    except ValidationError as exc:
        return jsonify({"error": exc.messages}), 400

    for key, value in payload.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify(user.to_dict())


@users_bp.delete("/<int:user_id>")
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    Order.query.filter(Order.user_id == user.id).delete(synchronize_session=False)
    db.session.delete(user)
    db.session.commit()
    refresh_business_metrics()
    return jsonify({"deleted": True})
