"""Serveur du frontend React (SPA) construit.

La vue `spa_index` renvoie le `index.html` produit par `npm run build`
depuis `frotend/dist/`. Le routing des routes clientes est assuré par
React Router ; Django ne garde que les endpoints serveur (API, paiement,
confirmations, admin) via l'exclusion dans agence/urls.py.
"""
from pathlib import Path

from django.conf import settings
from django.http import Http404, HttpResponse
from django.utils.cache import patch_cache_control
from django.views.decorators.csrf import ensure_csrf_cookie

INDEX_PATH = Path(settings.BASE_DIR).parent / 'frotend' / 'dist' / 'index.html'


@ensure_csrf_cookie
def spa_index(request):
    """Renvoie le HTML du frontend construit pour toute route côté client."""
    try:
        content = INDEX_PATH.read_bytes()
    except (OSError, FileNotFoundError):
        raise Http404("Le frontend construit est introuvable (frotend/dist/index.html).")

    response = HttpResponse(content, content_type='text/html; charset=utf-8')
    if not settings.DEBUG:
        patch_cache_control(response, no_cache=True)
    return response