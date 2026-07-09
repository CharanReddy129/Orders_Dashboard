import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import text

from .config import Config
from .database import db
from .metrics.metrics import init_metrics, refresh_business_metrics
from .middleware.logging import configure_logging
from .models import Order, Product, User  # noqa: F401
from .routes import health_bp, metrics_bp, orders_bp, products_bp, users_bp
from .utils.seed_data import seed_database

load_dotenv()


def create_app(config_override=None):
    app = Flask(__name__)
    app.config.from_object(Config)

    if config_override:
        app.config.update(config_override)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    configure_logging(app)
    init_metrics(app)

    app.register_blueprint(health_bp)
    app.register_blueprint(metrics_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)

    with app.app_context():
        db.create_all()
        try:
            db.session.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email_unique ON users (email)"))
            db.session.commit()
        except Exception:
            db.session.rollback()

        try:
            seed_database()
        except Exception:
            db.session.rollback()
            raise
        refresh_business_metrics()

    return app
