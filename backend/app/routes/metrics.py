from flask import Blueprint

from app.metrics.metrics import metrics_response

metrics_bp = Blueprint("metrics", __name__, url_prefix="/api")


@metrics_bp.get("/metrics")
def metrics():
    return metrics_response()
