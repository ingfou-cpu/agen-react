#!/usr/bin/env python
"""Dev HTTPS server (werkzeug + Django WSGI). Run: python https_devserver.py"""
import os
import ssl
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "agence.settings")
import django

django.setup()

from django.conf import settings
from django.core.wsgi import get_wsgi_application
from werkzeug.serving import run_simple

app = get_wsgi_application()
if settings.DEBUG:
    from django.contrib.staticfiles.handlers import StaticFilesHandler

    app = StaticFilesHandler(app)

ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
base = os.path.dirname(os.path.abspath(__file__))
ctx.load_cert_chain(os.path.join(base, "dev_cert.pem"), os.path.join(base, "dev_key.pem"))

run_simple("127.0.0.1", 8000, app, ssl_context=ctx, use_reloader=False, use_debugger=True, threaded=True)
