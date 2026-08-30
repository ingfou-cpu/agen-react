from django.conf import settings


def backend_url(request):
    """Expose BACKEND_BASE_URL aux templates Django."""
    return {'BACKEND_BASE_URL': getattr(settings, 'BACKEND_BASE_URL', 'http://127.0.0.1:8000')}
