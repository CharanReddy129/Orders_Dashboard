import logging
import os
import sys
from datetime import datetime


class JsonFormatter(logging.Formatter):
    def format(self, record):
        payload = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "message": record.getMessage(),
        }
        return str(payload)


def configure_logging(app):
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    app.logger.handlers = [handler]
    app.logger.setLevel(level)
