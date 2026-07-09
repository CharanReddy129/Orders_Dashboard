from prometheus_client import CONTENT_TYPE_LATEST, CollectorRegistry, Counter, Gauge, Histogram, Info, generate_latest
from flask import Response, request

registry = CollectorRegistry(auto_describe=True)

http_requests_total = Counter(
    "http_requests_total",
    "Total HTTP requests by method, endpoint, and status",
    ["method", "endpoint", "status_code"],
    registry=registry,
)
http_request_duration_seconds = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration in seconds",
    registry=registry,
)
orders_created_total = Counter("orders_created_total", "Orders created successfully", registry=registry)
orders_failed_total = Counter(
    "orders_failed_total",
    "Orders failed due to validation or stock issues",
    ["reason"],
    registry=registry,
)
active_users = Gauge("active_users", "Number of active users", registry=registry)
products_available = Gauge("products_available", "Total available products", registry=registry)
inventory_quantity = Gauge(
    "inventory_quantity",
    "Inventory quantity by product",
    ["product_name"],
    registry=registry,
)
orders_status_total = Counter(
    "orders_status_total",
    "Orders by status",
    ["status"],
    registry=registry,
)
orders_total = Gauge("orders_total", "Total number of orders", registry=registry)
business_revenue_total = Gauge(
    "business_revenue_total",
    "Total revenue from completed orders",
    registry=registry,
)
low_stock_products = Gauge(
    "low_stock_products",
    "Number of products with low inventory",
    registry=registry,
)
pending_orders = Gauge("pending_orders", "Number of pending orders", registry=registry)
cancelled_orders = Gauge("cancelled_orders", "Number of cancelled orders", registry=registry)
database_query_duration_seconds = Histogram(
    "database_query_duration_seconds",
    "Duration of database queries",
    registry=registry,
)
application_info = Info("application_info", "Application metadata", registry=registry)
application_start_time_seconds = Gauge(
    "application_start_time_seconds",
    "Application start time",
    registry=registry,
)


def init_metrics(app):
    application_info.info({"version": "1.0.0", "environment": app.config.get("APP_ENV", "development")})
    application_start_time_seconds.set_to_current_time()

    @app.before_request
    def before_request():
        request._start_time = __import__("time").perf_counter()

    @app.after_request
    def after_request(response):
        duration = __import__("time").perf_counter() - request._start_time
        http_requests_total.labels(
            method=request.method,
            endpoint=request.path,
            status_code=response.status_code,
        ).inc()
        http_request_duration_seconds.observe(duration)
        return response


def refresh_business_metrics():
    from app.models import Product, User, Order

    active_users.set(User.query.filter_by(status="Active").count())
    products_available.set(Product.query.count())
    orders_total.set(Order.query.count())
    business_revenue_total.set(sum(order.total_price for order in Order.query.filter_by(status="Completed").all()))
    low_stock_products.set(Product.query.filter(Product.quantity_available <= 10).count())
    pending_orders.set(Order.query.filter_by(status="Pending").count())
    cancelled_orders.set(Order.query.filter_by(status="Cancelled").count())
    for product in Product.query.all():
        inventory_quantity.labels(product_name=product.name).set(product.quantity_available)


def metrics_response():
    return Response(generate_latest(registry), mimetype=CONTENT_TYPE_LATEST)
