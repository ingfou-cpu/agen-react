"""
URL configuration for agence project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from . import settings
from django.conf.urls.static import static
from . import spa_views

# L'attrape-tout SPA doit venir AVANT les includes Django (Agapp, weatherapp)
# pour que le frontend React prenne le dessus sur les templates legacy.
# Les préfixes exclus restent servis par Django (API, admin, media/static
# gérés par PythonAnywhere, Stripe, pages de confirmation).
_spa_exclusions = (
    r'^(?!'
    r'api/|admin/|media/|static/|assets/|api-auth/|'
    r'payment/checkout/|payment/webhook/|'
    r'booking/confirmation/|circuit/confirmation/|booking/recap/|'
    r'lang/|testimonial_form/|history/'
    r').*$'
)

urlpatterns = [
    re_path(_spa_exclusions, spa_views.spa_index, name='spa_index'),
    path('admin/', admin.site.urls),
    path('', include('Agapp.urls')),
    path('weather/', include('weatherapp.urls'), name='weather_index'),
    path('api-auth/', include('rest_framework.urls')),  # Ajoutez cette ligne pour l'authentification de l'API

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
