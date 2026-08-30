from django.shortcuts import render, redirect
from django.utils.translation import gettext as _, gettext_lazy
import requests
from .models import SearchHistory
from datetime import datetime

# Create your views here.


API_KEY = "4d7e013edeb48f3561ed2c988b3cfaf1"


# Mapping des codes météo Open-Meteo vers descriptions FR et emojis
WMO_CODES = {
    0: (gettext_lazy('Dégagé'), '☀️'),
    1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌧️',
    56: '🌧️', 57: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    66: '🌧️', 67: '🌧️',
    71: '❄️', 73: '❄️', 75: '❄️',
    77: '❄️',
    80: '🌦️', 81: '🌧️', 82: '⛈️',
    85: '🌨️', 86: '🌨️',
    95: '⛈️', 96: '⛈️', 99: '⛈️',
}

WMO_DESCRIPTIONS = {
    0: gettext_lazy('Dégagé'), 1: gettext_lazy('Principalement dégagé'), 2: gettext_lazy('Partiellement nuageux'), 3: gettext_lazy('Couvert'),
    45: gettext_lazy('Brouillard'), 48: gettext_lazy('Brouillard givrant'),
    51: gettext_lazy('Bruine légère'), 53: gettext_lazy('Bruine modérée'), 55: gettext_lazy('Bruine intense'),
    56: gettext_lazy('Bruine verglaçante'), 57: gettext_lazy('Bruine verglaçante forte'),
    61: gettext_lazy('Pluie légère'), 63: gettext_lazy('Pluie modérée'), 65: gettext_lazy('Pluie forte'),
    66: gettext_lazy('Pluie verglaçante'), 67: gettext_lazy('Pluie verglaçante forte'),
    71: gettext_lazy('Neige légère'), 73: gettext_lazy('Neige modérée'), 75: gettext_lazy('Neige forte'),
    77: gettext_lazy('Grésil'),
    80: gettext_lazy('Averses'), 81: gettext_lazy('Averses modérées'), 82: gettext_lazy('Averses violentes'),
    85: gettext_lazy('Averses de neige'), 86: gettext_lazy('Averses de neige fortes'),
    95: gettext_lazy('Orage'), 96: gettext_lazy('Orage avec grêle'), 99: gettext_lazy('Orage violent avec grêle'),
}


def get_weather_for_city(city_name):
    """Récupère les données météo actuelles pour une ville donnée.
    Retourne un dict avec les données météo ou None en cas d'erreur."""
    if not city_name:
        return None
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={API_KEY}&units=metric"
    try:
        resp = requests.get(url, timeout=5)
        data = resp.json()
        if resp.status_code == 200:
            return {
                'city': f"{data['name']}, {data['sys']['country']}",
                'temperature': data['main']['temp'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'description': data['weather'][0]['description'].title(),
                'icon': data['weather'][0]['icon'],
                'lat': data['coord']['lat'],
                'lon': data['coord']['lon'],
            }
    except requests.RequestException:
        pass
    return None


def get_7day_forecast(city_name, lat=None, lon=None):
    """Récupère les prévisions météo sur 7 jours via Open-Meteo (API gratuite, sans clé).
    Retourne une liste de dicts avec les prévisions quotidiennes ou None."""
    if not city_name:
        return None

    # Si lat/lon ne sont pas fournis, les récupérer via OpenWeatherMap
    if lat is None or lon is None:
        weather = get_weather_for_city(city_name)
        if not weather or 'lat' not in weather or 'lon' not in weather:
            return None
        lat = weather['lat']
        lon = weather['lon']

    # Appel à Open-Meteo pour les prévisions sur 7 jours
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&daily=temperature_2m_max,temperature_2m_min,weathercode"
        f"&timezone=auto&forecast_days=7"
    )

    try:
        resp = requests.get(url, timeout=10)
        data = resp.json()
        if resp.status_code != 200 or 'daily' not in data:
            return None

        daily = data['daily']
        forecast = []

        for i in range(len(daily['time'])):
            date_obj = datetime.strptime(daily['time'][i], '%Y-%m-%d')
            weather_code = daily['weathercode'][i]

            code_entry = WMO_CODES.get(weather_code, '❓')
            if isinstance(code_entry, tuple):
                emoji = code_entry[1]
            else:
                emoji = code_entry

            forecast.append({
                'date': daily['time'][i],
                'day_offset': i,
                'weekday': date_obj.weekday(),
                'temp_max': round(daily['temperature_2m_max'][i]),
                'temp_min': round(daily['temperature_2m_min'][i]),
                'weather_code': weather_code,
                'emoji': emoji,
            })

        return forecast
    except requests.RequestException:
        return None


def index(request):
    weather = None
    error = None
    recent_searches = SearchHistory.objects.order_by('-searched_at')[:5]

    if request.method == "POST":
        city = request.POST.get('city', '').strip()
        if city:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
            try:
                resp = requests.get(url, timeout=5)
                data = resp.json()

                if resp.status_code == 200:
                    weather = {
                        'city': f"{data['name']}, {data['sys']['country']}",
                        'temperature': data['main']['temp'],
                        'humidity': data['main']['humidity'],
                        'pressure': data['main']['pressure'],
                        'description': data['weather'][0]['description'].title(),
                        'icon': data['weather'][0]['icon'],
                    }
                    SearchHistory.objects.create(
                        city_name=data['name'],
                        temperature=data['main']['temp'],
                        humidity=data['main']['humidity'],
                        pressure=data['main']['pressure'],
                        description=data['weather'][0]['description'].title()
                    )
                    recent_searches = SearchHistory.objects.order_by('-searched_at')[:5]
                else:
                    error = data.get("message", _("Impossible de récupérer les données météo."))
            except requests.RequestException:
                error = _("Erreur réseau. Veuillez réessayer.")
        else:
            error = _("Veuillez entrer le nom d'une ville.")
    
    # Si la requête vient de home, sauvegarder en session et rediriger
    if request.POST.get('from_home'):
        request.session['weather_data'] = weather
        request.session['weather_error'] = error
        return redirect('home')

    return render(request, "index.html", {
        'weather': weather,
        'error': error,
        'recent_searches': recent_searches
    })