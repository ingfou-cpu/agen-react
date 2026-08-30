"""Mini API JSON d'authentification pour le frontend React.

Les vues HTML existantes (login_view, register, logout_view) restent utilisées par
le site Django ; ces endpoints JSON sont une passerelle pour l'application React.
"""
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST


@ensure_csrf_cookie
def me(request):
    """État de la session courante (pose aussi le cookie csrftoken)."""
    if request.user.is_authenticated:
        return JsonResponse({
            'authenticated': True,
            'username': request.user.username,
            'email': request.user.email,
        })
    return JsonResponse({'authenticated': False})


def _json_body(request):
    try:
        return json.loads(request.body or b'{}')
    except json.JSONDecodeError:
        return {}


@require_POST
def api_login(request):
    data = _json_body(request)
    user = authenticate(
        request,
        username=data.get('username', ''),
        password=data.get('password', ''),
    )
    if user is not None:
        login(request, user)
        return JsonResponse({'authenticated': True, 'username': user.username})
    return JsonResponse({'error': 'Identifiants incorrects.'}, status=400)


@require_POST
def api_register(request):
    data = _json_body(request)
    form = UserCreationForm(data)
    if form.is_valid():
        user = form.save()
        login(request, user)
        return JsonResponse(
            {'authenticated': True, 'username': user.username},
            status=201,
        )
    errors = {
        field: list(messages)
        for field, messages in form.errors.items()
    }
    return JsonResponse({'error': errors}, status=400)


@require_POST
def api_logout(request):
    logout(request)
    return JsonResponse({'ok': True})
