
from django.shortcuts import render, get_object_or_404, redirect
from .models import Destination, Booking, Contact, Testimonial, pack_travel, Hotel, reser_circuit, PaymentRecord, BlogPost, NewsletterSubscriber
from .forms import ContactForm, CommentForm
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.utils.translation import activate, gettext as _, gettext_lazy
import stripe, requests
from django.contrib.messages.views import SuccessMessageMixin #pour afficher le message de success
import logging
from django.views.generic.list import ListView 
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy
from weatherapp.models import SearchHistory
from weatherapp.views import get_weather_for_city, get_7day_forecast, WMO_DESCRIPTIONS
from datetime import datetime, timedelta
from rest_framework import viewsets, permissions
from .serializers import DestinationSerializer, HotelSerializer, BookingSerializer, PackTravelSerializer, ReserCircuitSerializer, ContactSerializer, TestimonialSerializer, PaymentRecordSerializer, BlogPostSerializer, BlogCommentSerializer, NewsletterSubscriberSerializer
from .models import Destination, Hotel, Booking, pack_travel, reser_circuit, Contact, Testimonial, PaymentRecord, BlogPost, BlogComment, NewsletterSubscriber
#from weatherapp.views import index as weather_index


logger = logging.getLogger(__name__)


def localize_forecast(forecast):
    if not forecast:
        return forecast
    day_names = [_('Lundi'), _('Mardi'), _('Mercredi'), _('Jeudi'), _('Vendredi'), _('Samedi'), _('Dimanche')]
    month_names = [_('janv.'), _('févr.'), _('mars'), _('avr.'), _('mai'), _('juin'),
                   _('juill.'), _('août'), _('sept.'), _('oct.'), _('nov.'), _('déc.')]
    localized = []
    for entry in forecast:
        weekday = entry['weekday']
        day_short = day_names[weekday][:3].upper()
        offset = entry['day_offset']
        if offset == 0:
            day_label = _("Aujourd'hui")
        elif offset == 1:
            day_label = _("Demain")
        else:
            day_label = day_names[weekday]
        date_obj = datetime.strptime(entry['date'], '%Y-%m-%d')
        date_display = f"{date_obj.day} {month_names[date_obj.month - 1]}"
        localized.append({
            'date': entry['date'],
            'day_label': day_label,
            'day_short': day_short,
            'date_display': date_display,
            'emoji': entry['emoji'],
            'description': str(WMO_DESCRIPTIONS.get(entry['weather_code'], gettext_lazy('Inconnu'))),
            'temp_max': entry['temp_max'],
            'temp_min': entry['temp_min'],
            'weather_code': entry['weather_code'],
        })
    return localized

# Create your views here.-


"""def home(request):
    #bookings = Booking.objects.all()
    pack_travels = pack_travel.objects.all()
    Destinations = Destination.objects.all()
    return render(request, 'home.html', {'pack_travel': pack_travels, 'Destination': Destinations})"""

class HomeView(ListView):
    model = Destination
    #paginate_by = 4 # Afficher 4 destinations par page
    template_name = 'home.html'
    context_object_name = 'Destination'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pack_travels'] = pack_travel.objects.all()
        context['SearchHistorys'] = SearchHistory.objects.order_by('-searched_at')[:5]
        # Récupérer les données météo de la session si elles existent
        context['weather_data'] = self.request.session.get('weather_data', None)
        context['weather_error'] = self.request.session.get('weather_error', None)

        # Récupérer les prévisions 7 jours (avec cache en session + TTL 1h)
        FORECAST_CACHE_TTL = 3600  # 1 heure en secondes
        forecast_city = self.request.session.get('forecast_city', None)
        cached_forecast = self.request.session.get('forecast_7days_cache_v2', None)
        cached_city = self.request.session.get('forecast_7days_city', None)
        cached_timestamp = self.request.session.get('forecast_7days_timestamp', None)

        # Vérifier si le cache est encore valide
        cache_expired = True
        if cached_timestamp:
            elapsed = (datetime.now() - datetime.fromisoformat(cached_timestamp)).total_seconds()
            cache_expired = elapsed > FORECAST_CACHE_TTL

        if forecast_city and cached_forecast and cached_city == forecast_city and not cache_expired:
            context['forecast_7days'] = localize_forecast(cached_forecast)
        elif forecast_city:
            weather_session = self.request.session.get('weather_data', None)
            lat = weather_session.get('lat') if weather_session else None
            lon = weather_session.get('lon') if weather_session else None
            forecast = get_7day_forecast(forecast_city, lat=lat, lon=lon)
            context['forecast_7days'] = localize_forecast(forecast)
            self.request.session['forecast_7days_cache_v2'] = forecast
            self.request.session['forecast_7days_city'] = forecast_city
            self.request.session['forecast_7days_timestamp'] = datetime.now().isoformat()
        else:
            context['forecast_7days'] = None

        return context

    def post(self, request, *args, **kwargs):
        """Gérer la soumission du formulaire météo"""
        city = request.POST.get('city', '').strip()
        if city:
            weather = get_weather_for_city(city)
            if weather:
                request.session['weather_data'] = weather
                request.session['weather_error'] = None
                request.session['forecast_city'] = city
                # Invalider le cache forecast si la ville change
                if request.session.get('forecast_7days_city') != city:
                    request.session['forecast_7days_cache_v2'] = None
                    request.session['forecast_7days_city'] = None
                    request.session['forecast_7days_timestamp'] = None
            else:
                request.session['weather_data'] = None
                request.session['weather_error'] = f"Impossible de trouver la météo pour '{city}'."
                request.session['forecast_city'] = None
                request.session['forecast_7days_cache_v2'] = None
                request.session['forecast_7days_city'] = None
                request.session['forecast_7days_timestamp'] = None
        else:
            request.session['weather_data'] = None
            request.session['weather_error'] = "Veuillez entrer un nom de ville."
            request.session['forecast_city'] = None
            request.session['forecast_7days_cache_v2'] = None
            request.session['forecast_7days_city'] = None
            request.session['forecast_7days_timestamp'] = None
        return redirect(reverse('home') + '#weather')

class contactcreteview(SuccessMessageMixin, CreateView):
    model = Contact
    form_class = ContactForm
    template_name = 'contact.html'
    success_url = reverse_lazy('contact') # redirige vers la même page après soumission du formulaire
    success_message = "✅ Votre message a été envoyé avec succès !"
    
"""def contact(request):
    submitted = False
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('contact') + '?submitted=True')
    else:
        form = ContactForm
        if 'submitted' in request.GET:
            submitted = True
    return render(request, 'contact.html', {'form': form, 'submitted': submitted})"""

class temoignageViewV(CreateView):
    model = Testimonial
    template_name = 'testimonial_form.html' # On peut aussi utiliser 'temoignage.html' à la place de 'testimonial_form.html' pour afficher les témoignages dans une page dédiée
    fields = ['customer_name', 'destination', 'rating', 'comment']
    context_object_name = 'Testimonial'
    
    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, "Le livre a été créé avec succès.")
        return response
    success_url = reverse_lazy('temoignage') # redirige vers la page de témoignages après soumission du formulaire

"""def temoignage(request):
    testimonials = Testimonial.objects.all()
    destinations = Destination.objects.all()
    bookings = Booking.objects.all()
    return render(request, 'temoignage.html',{'Testimonial': testimonials, 'Destination': destinations,'Booking': bookings})"""

class temoignageView(ListView):
    model = Testimonial
    paginate_by = 2 # Nombre d'éléments par page
    template_name = 'temoignage.html'
    context_object_name = 'Testimonial'#Avec ListView et model = Testimonial, Django crée automatiquement la variable object_list (et non Testimonial).

def reservation(request):   
    Hotels = Hotel.objects.all()
    Destinations = Destination.objects.all()
    customer_name = ''
    if request.method == 'POST':
        name = request.POST.get('customer_name')
        email = request.POST.get('customer_email')
        phone_number = request.POST.get('phone_number')
        destination_id = request.POST.get('destination')
        check_in = request.POST.get('check_in')
        check_out = request.POST.get('check_out')
        hotel_id = request.POST.get('hotel')
        means_of_transport = request.POST.get('means_of_transport')
        customer_name = name or ''

        try:
            destination = Destination.objects.get(id=destination_id) if destination_id else None
            hotel = Hotel.objects.get(id=hotel_id) if hotel_id else None

            if destination:
                booking = Booking(
                    customer_name=name,
                    customer_email=email,
                    phone_number=phone_number,
                    destination=destination,
                    hotel=hotel,
                    check_in_date=check_in,
                    check_out_date=check_out,
                    means_of_transport=means_of_transport
                )
                booking.save()
        except (Destination.DoesNotExist, Hotel.DoesNotExist):
            pass
    return render(request, 'reservation.html', {'Hotels': Hotels, 'Destinations': Destinations, 'customer_name': customer_name})


def reselieuChoisi(request, destination_id):
    """Page de réservation pour une destination.
    Après soumission du formulaire : crée la réservation, puis redirige
    vers la page de confirmation从中 le client pourra lancer le paiement."""
    destination = Destination.objects.get(id=destination_id)
    hotels = Hotel.objects.filter(destination=destination)
    confirmation_message = None
    created_booking = None

    # Récupérer la météo de la destination (avec cache session TTL 1h)
    DEST_WEATHER_TTL = 3600
    dest_weather = None
    if destination.city_name:
        cache_key = f"dest_weather_{destination.id}"
        cache_ts_key = f"dest_weather_ts_{destination.id}"
        cached = request.session.get(cache_key, None)
        cached_ts = request.session.get(cache_ts_key, None)

        cache_expired = True
        if cached_ts:
            elapsed = (datetime.now() - datetime.fromisoformat(cached_ts)).total_seconds()
            cache_expired = elapsed > DEST_WEATHER_TTL

        if cached and not cache_expired:
            dest_weather = cached
        else:
            dest_weather = get_weather_for_city(destination.city_name)
            request.session[cache_key] = dest_weather
            request.session[cache_ts_key] = datetime.now().isoformat()

    if request.method == 'POST':
        name = request.POST.get('customer_name')
        email = request.POST.get('customer_email')
        phone_number = request.POST.get('phone_number')
        hotel_id = request.POST.get('hotel')
        check_in = request.POST.get('check_in')
        check_out = request.POST.get('check_out')
        means_of_transport = request.POST.get('means_of_transport')

        try:
            hotel = Hotel.objects.get(id=hotel_id) if hotel_id else None
            booking = Booking(
                customer_name=name,
                customer_email=email,
                phone_number=phone_number,
                destination=destination,
                hotel=hotel,
                check_in_date=check_in,
                check_out_date=check_out,
                means_of_transport=means_of_transport
            )
            booking.save()
            created_booking = booking
            # Stocker l'ID et les infos client dans la session pour la page de confirmation
            request.session['pending_booking_id'] = booking.id
            request.session['pending_customer_name'] = name
            request.session['pending_customer_email'] = email
            request.session['pending_customer_phone'] = phone_number
        except Hotel.DoesNotExist:
            confirmation_message = "❌ Erreur : l'hôtel sélectionné n'existe pas."

    # Si une réservation vient d'être créée, rediriger vers la confirmation
    if created_booking:
        return redirect('booking_confirmation', booking_id=created_booking.id)

    return render(request, 'reselieuChoisi.html', {
        'destination': destination,
        'hotels': hotels,
        'confirmation_message': confirmation_message,
        'dest_weather': dest_weather,
    })


def reservCroisiere(request, pack_travel_id):
    """Réservation de croisière/circuit en 2 étapes.
    Étape 1 : calcul du prix. Étape 2 : confirmation → redirection
    vers la page de confirmation circuit."""
    pack_travel_instance = get_object_or_404(pack_travel, id=pack_travel_id)
    customer_name = ''
    customer_email = ''
    customer_phone = ''
    nombre_personnes = 1
    nombre_enfants = 0
    confirmation_message = None
    show_confirmation = False

    if request.method == 'POST':
        step = request.POST.get('step', 'calcul')

        name = request.POST.get('customer_name')
        email = request.POST.get('customer_email')
        phone_number = request.POST.get('phone_number')
        nombre_personnes = request.POST.get('nombre_personnes')
        nombre_enfants = request.POST.get('nombre_enfants')
        customer_name = name or ''
        customer_email = email or ''
        customer_phone = phone_number or ''
        nb_personnes = int(nombre_personnes) if nombre_personnes else 1
        nb_enfants = int(nombre_enfants) if nombre_enfants else 0

        if step == 'calcul':
            show_confirmation = True
        elif step == 'confirm':
            try:
                reservation = reser_circuit(
                    pack_travel=pack_travel_instance,
                    customer_name=name,
                    customer_email=email,
                    phone_number=phone_number,
                )
                reservation.save()
                return redirect('circuit_confirmation', circuit_booking_id=reservation.id)
            except Exception as e:
                confirmation_message = f"❌ Erreur lors de la réservation : {str(e)}"

    return render(request, 'reservCroisiere.html', {
        'pack_travel': pack_travel_instance,
        'customer_name': customer_name,
        'customer_email': customer_email,
        'customer_phone': customer_phone,
        'nombre_personnes': nombre_personnes,
        'nombre_enfants': nombre_enfants,
        'confirmation_message': confirmation_message,
        'show_confirmation': show_confirmation
    })

def about(request):
    return render(request, 'about.html', {  })


def croisiere(request):
    pack_travels = pack_travel.objects.all()
    return render(request, 'croisiere.html', {'pack_travel': pack_travels})


#-----------------------------circuit------------------------------------------------------------
def circuit(request):
    pack_travels = pack_travel.objects.all()
    Destinations = Destination.objects.all()
    return render(request, 'circuit_touris.html', {'Destination': Destinations, 'pack_travels': pack_travels})


class circuitChoisiView(DetailView):
    model = pack_travel
    template_name = 'circuitChoisi.html'
    context_object_name = 'pack_travels'

    def post(self, request, *args, **kwargs):
        """Gérer la soumission du formulaire de réservation.
        Après création, rediriger vers la page de confirmation circuit."""
        self.object = self.get_object()
        pack_travel_instance = self.object

        name = request.POST.get('customer_name')
        email = request.POST.get('customer_email')
        phone_number = request.POST.get('phone_number')

        try:
            reservation = reser_circuit(
                customer_name=name,
                customer_email=email,
                phone_number=phone_number,
                pack_travel=pack_travel_instance
            )
            reservation.save()
            # Stocker les infos dans la session pour la confirmation
            request.session['pending_circuit_booking_id'] = reservation.id
            return redirect('circuit_confirmation', circuit_booking_id=reservation.id)
        except Exception as e:
            messages.error(request, f"❌ Erreur : {str(e)}")

        return redirect('circuitChoisi', pk=pack_travel_instance.pk)

"""def circuitChoisi(request, pack_travel_id):
    pack_travels = pack_travel.objects.get(id=pack_travel_id)
    confirmation_message = None

    if request.method == 'POST':
        name = request.POST.get('customer_name')
        email = request.POST.get('customer_email')
        phone_number = request.POST.get('phone_number')

        try:
            booking = reser_circuit(
                customer_name=name,
                customer_email=email,
                phone_number=phone_number,
                pack_travel=pack_travels
            )
            booking.save()
            confirmation_message = "✅ Votre réservation a été confirmée avec succès !"
        except Exception as e:
            confirmation_message = f"❌ Erreur : {str(e)}"

    return render(request, 'circuitChoisi.html', {
        'pack_travels': pack_travels,
        'confirmation_message': confirmation_message
    })"""
#============================= Corrency payment =============================#
def convertir_devise(request):
    # Remplacez par votre clé API (Ne la partagez jamais publiquement)
    api_key =  settings.VOTRE_CLE_API_FIXER
       
    #url = f'http://fixer.io{api_key}&symbols=USD,EUR,DZD'
    url = f'http://data.fixer.io/api/latest?access_key={api_key}&symbols=USD,EUR,DZD'

    taux_de_change = {}
    erreur = None

    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200 and data.get('success'):
            taux_de_change = data.get('rates')
        else:
            erreur = f"Erreur API : {data.get('error', {}).get('info', 'Inconnue')}"
    except Exception as e:
        erreur = f"Connexion impossible : {str(e)}"

    contexte = {
        'taux': taux_de_change,
        'erreur': erreur
    }
    return render(request, 'convertisseur.html', contexte)


def latest_rates_api(request):
    """API endpoint qui retourne les derniers taux de change. Utilise Fixer si la clé
    est configurée (supporte DZD/MAD/TND), sinon Frankfurter (gratuite, sans clé).
    Si Fixer échoue, fallback automatique vers Frankfurter."""
    from_currency = request.GET.get('from', 'EUR')
    symbols = request.GET.get('symbols', 'USD,EUR,DZD,GBP,CHF,MAD,TND,CNY,JPY,CAD')

    api_key = getattr(settings, 'VOTRE_CLE_API_FIXER', '')

    # Liste des providers à essayer dans l'ordre
    providers = []
    if api_key:
        providers.append(('Fixer', f'http://data.fixer.io/api/latest?access_key={api_key}&symbols={symbols}'))
    providers.append(('Frankfurter', f'https://api.frankfurter.app/latest?from={from_currency}&symbols={symbols}'))

    last_error = None
    for name, url in providers:
        try:
            response = requests.get(url, timeout=10)
            data = response.json()

            if response.status_code == 200 and 'rates' in data:
                return JsonResponse({'success': True, 'base': data.get('base', from_currency), 'date': data.get('date'), 'rates': data['rates']})
            elif response.status_code == 200 and data.get('success') is False:
                last_error = data.get('error', {}).get('info', f'Erreur {name}')
            else:
                last_error = f'Erreur {name} (HTTP {response.status_code})'
        except Exception as e:
            last_error = str(e)

    return JsonResponse({'success': False, 'error': last_error or 'Impossible de récupérer les taux de change'})


def historical_rates_api(request):
    """API endpoint qui retourne les taux historiques sur 7 jours via Frankfurter API (gratuite, sans clé)"""
    from_currency = request.GET.get('from', 'EUR')
    to_currency = request.GET.get('to', 'USD')

    # Calculer les dates: aujourd'hui - 7 jours
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')

    url = f'https://api.frankfurter.app/{start_date}..{end_date}?from={from_currency}&to={to_currency}'

    try:
        response = requests.get(url, timeout=10)
        data = response.json()

        if response.status_code == 200 and 'rates' in data:
            # Transformer en tableau de {date, rate}
            historical = []
            for date_str, rate_val in sorted(data['rates'].items()):
                historical.append({
                    'date': date_str,
                    'rate': rate_val.get(to_currency, 0)
                })
            return JsonResponse({'success': True, 'data': historical, 'base': from_currency, 'target': to_currency})
        else:
            return JsonResponse({'success': False, 'error': 'Impossible de récupérer les données historiques'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
#============================= VUES PAIEMENT STRIPE =============================#

def payment_home(request):
    """Page de paiement avec liste des destinations et packs"""
    destinations = Destination.objects.all()
    packs = pack_travel.objects.all()
    context = {
        'destinations': destinations,
        'packs': packs,
        'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
    }
    return render(request, 'payment_home.html', context)


def _get_stripe_base_url(request):
    """Retourne l'URL de base en fonction de l'origine de la requête.
    Si la requête vient du frontend React (Referer = :5173), on redirige
    vers le frontend. Sinon, on reste dans le backend Django."""
    referer = request.META.get('HTTP_REFERER', '')
    frontend_port = settings.FRONTEND_BASE_URL.split(':')[-1].rstrip('/')
    if frontend_port in referer:
        return settings.FRONTEND_BASE_URL
    return settings.BACKEND_BASE_URL


def create_checkout_destination(request, destination_id):
    """Crée une session de paiement Stripe pour une destination.
    Si un booking_id est fourni (via la session ou le POST), il est
    passé dans les métadonnées Stripe pour que le webhook puisse
    lier le paiement à la réservation existante."""
    if request.method != "POST":
        return redirect('payment_home')

    stripe.api_key = settings.STRIPE_SECRET_KEY
    destination = get_object_or_404(Destination, id=destination_id)

    # Déterminer l'URL de redirection selon l'origine (frontend ou backend)
    base_url = _get_stripe_base_url(request)

    # Récupérer un éventuel booking_id (depuis la session Django ou le POST)
    booking_id = request.POST.get('booking_id', '') or request.session.pop('booking_id', '')

    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": f"Voyage - {destination.name}",
                            "description": destination.description or f"Réservation pour {destination.name}",
                        },
                        "unit_amount": int(destination.price * 100),
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=f"{base_url}/payment/success/?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{base_url}/payment/cancel/",
            metadata={
                'type': 'destination',
                'destination_id': destination.id,
                'booking_id': str(booking_id),
                'customer_name': request.POST.get('customer_name', ''),
                'customer_email': request.POST.get('customer_email', ''),
                'customer_phone': request.POST.get('customer_phone', ''),
            }
        )

        PaymentRecord.objects.create(
            destination=destination,
            stripe_checkout_session_id=checkout_session.id,
            amount=destination.price,
            customer_name=request.POST.get('customer_name', ''),
            customer_email=request.POST.get('customer_email', ''),
            customer_phone=request.POST.get('customer_phone', ''),
            status='pending',
        )

        return redirect(checkout_session.url, code=303)

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        messages.error(request, f"Erreur de paiement: {str(e)}")
        return redirect('payment_home')
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        messages.error(request, "Une erreur inattendue s'est produite.")
        return redirect('payment_home')


def create_checkout_pack(request, pack_id):
    """Crée une session de paiement Stripe pour un pack/circuit.
    Si un circuit_booking_id est fourni, il est passé dans les métadonnées
    Stripe pour que le webhook puisse lier le paiement à la réservation."""
    if request.method != "POST":
        return redirect('payment_home')

    stripe.api_key = settings.STRIPE_SECRET_KEY
    pack = get_object_or_404(pack_travel, id=pack_id)

    # Déterminer l'URL de redirection selon l'origine (frontend ou backend)
    base_url = _get_stripe_base_url(request)

    # Récupérer un éventuel circuit_booking_id
    circuit_booking_id = request.POST.get('circuit_booking_id', '') or request.session.pop('circuit_booking_id', '')

    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": f"Pack - {pack.pack_name}",
                            "description": pack.description or f"Pack voyage: {pack.pack_name}",
                        },
                        "unit_amount": int(pack.price * 100),
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=f"{base_url}/payment/success/?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{base_url}/payment/cancel/",
            metadata={
                'type': 'pack',
                'pack_id': pack.id,
                'circuit_booking_id': str(circuit_booking_id),
                'customer_name': request.POST.get('customer_name', ''),
                'customer_email': request.POST.get('customer_email', ''),
                'customer_phone': request.POST.get('customer_phone', ''),
            }
        )

        PaymentRecord.objects.create(
            pack=pack,
            stripe_checkout_session_id=checkout_session.id,
            amount=pack.price,
            customer_name=request.POST.get('customer_name', ''),
            customer_email=request.POST.get('customer_email', ''),
            customer_phone=request.POST.get('customer_phone', ''),
            status='pending',
        )

        return redirect(checkout_session.url, code=303)

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        messages.error(request, f"Erreur de paiement: {str(e)}")
        return redirect('payment_home')
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        messages.error(request, "Une erreur inattendue s'est produite.")
        return redirect('payment_home')


def payment_success(request):
    """Page de succès après un paiement Stripe.
    Fallback : si le webhook n'a pas encore créé le Booking, on le
    crée ici pour garantir que la page de confirmation peut afficher
    les détails de la réservation."""
    session_id = request.GET.get('session_id')
    payment_record = None

    if session_id:
        try:
            payment_record = PaymentRecord.objects.get(
                stripe_checkout_session_id=session_id
            )
            payment_record.status = 'completed'
            payment_record.save()

            # Créer la réservation uniquement si elle n'existe pas encore
            if not payment_record.booking_id and payment_record.destination and payment_record.customer_name:
                booking = Booking.objects.create(
                    destination=payment_record.destination,
                    customer_name=payment_record.customer_name,
                    customer_email=payment_record.customer_email,
                    phone_number=payment_record.customer_phone,
                )
                payment_record.booking = booking
                payment_record.save()
                logger.info(f"Booking #{booking.id} created from payment_success for session {session_id}")

            elif not payment_record.reser_circuit_id and payment_record.pack and payment_record.customer_name:
                circuit_booking = reser_circuit.objects.create(
                    pack_travel=payment_record.pack,
                    customer_name=payment_record.customer_name,
                    customer_email=payment_record.customer_email,
                    phone_number=payment_record.customer_phone,
                )
                payment_record.reser_circuit = circuit_booking
                payment_record.save()
                logger.info(f"ReserCircuit #{circuit_booking.id} created from payment_success for session {session_id}")

        except PaymentRecord.DoesNotExist:
            logger.warning(f"Payment record not found: {session_id}")

    return render(request, 'payment_success.html', {'payment_record': payment_record})


def payment_cancel(request):
    """Page d'annulation de paiement"""
    return render(request, 'payment_cancel.html')


@csrf_exempt
@require_POST
def stripe_webhook(request):
    """Webhook pour gérer les événements Stripe"""
    stripe.api_key = settings.STRIPE_SECRET_KEY
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        logger.error(f"Invalid payload: {str(e)}")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {str(e)}")
        return HttpResponse(status=400)

    event_type = event['type']
    logger.info(f"Received Stripe event: {event_type}")

    if event_type == 'checkout.session.completed':
        handle_checkout_completed(event['data']['object'])
    elif event_type == 'checkout.session.expired':
        handle_checkout_expired(event['data']['object'])
    elif event_type == 'payment_intent.succeeded':
        handle_payment_succeeded(event['data']['object'])
    elif event_type == 'payment_intent.payment_failed':
        handle_payment_failed(event['data']['object'])

    return HttpResponse(status=200)


def handle_checkout_completed(session):
    """Gère l'événement checkout.session.completed.
    Crée la réservation (Booking / reser_circuit) si elle n'existe pas
    encore et la lie au PaymentRecord pour que la page de confirmation
    puisse afficher « Réservation effectuée avec paiement réussi »."""
    session_id = session.get('id')
    try:
        payment = PaymentRecord.objects.get(stripe_checkout_session_id=session_id)
        payment.status = 'completed'
        payment.stripe_customer_id = session.get('customer', '')
        payment.stripe_payment_intent_id = session.get('payment_intent', '')
        meta = session.get('metadata', {})

        # ── Destination : lier ou créer le Booking ──
        if not payment.booking_id:
            booking_id = meta.get('booking_id', '')
            if booking_id:
                try:
                    existing_booking = Booking.objects.get(id=int(booking_id))
                    payment.booking = existing_booking
                    logger.info(f"Booking #{booking_id} linked to payment {session_id}")
                except (Booking.DoesNotExist, ValueError):
                    pass

            if not payment.booking_id:
                dest_id = meta.get('destination_id')
                if dest_id:
                    booking = Booking.objects.create(
                        destination_id=int(dest_id),
                        customer_name=meta.get('customer_name', ''),
                        customer_email=meta.get('customer_email', ''),
                        phone_number=meta.get('customer_phone', ''),
                    )
                    payment.booking = booking
                    logger.info(f"Booking #{booking.id} created from payment {session_id}")

        # ── Pack/Circuit : lier ou créer le reser_circuit ──
        if not payment.reser_circuit_id:
            circuit_booking_id = meta.get('circuit_booking_id', '')
            if circuit_booking_id:
                try:
                    existing_circuit = reser_circuit.objects.get(id=int(circuit_booking_id))
                    payment.reser_circuit = existing_circuit
                    logger.info(f"ReserCircuit #{circuit_booking_id} linked to payment {session_id}")
                except (reser_circuit.DoesNotExist, ValueError):
                    pass

            if not payment.reser_circuit_id:
                pack_id = meta.get('pack_id')
                if pack_id:
                    circuit = reser_circuit.objects.create(
                        pack_travel_id=int(pack_id),
                        customer_name=meta.get('customer_name', ''),
                        customer_email=meta.get('customer_email', ''),
                        phone_number=meta.get('customer_phone', ''),
                    )
                    payment.reser_circuit = circuit
                    logger.info(f"ReserCircuit #{circuit.id} created from payment {session_id}")

        payment.save()
        logger.info(f"Payment completed: {session_id}")
    except PaymentRecord.DoesNotExist:
        logger.warning(f"Payment not found: {session_id}")


def handle_checkout_expired(session):
    """Gère l'événement checkout.session.expired"""
    session_id = session.get('id')
    try:
        payment = PaymentRecord.objects.get(stripe_checkout_session_id=session_id)
        payment.status = 'expired'
        payment.save()
    except PaymentRecord.DoesNotExist:
        pass


def handle_payment_succeeded(payment_intent):
    """Gère l'événement payment_intent.succeeded"""
    payment_intent_id = payment_intent.get('id')
    try:
        payment = PaymentRecord.objects.get(stripe_payment_intent_id=payment_intent_id)
        payment.status = 'completed'
        payment.save()
    except PaymentRecord.DoesNotExist:
        pass


def handle_payment_failed(payment_intent):
    """Gère l'événement payment_intent.payment_failed"""
    payment_intent_id = payment_intent.get('id')
    try:
        payment = PaymentRecord.objects.get(stripe_payment_intent_id=payment_intent_id)
        payment.status = 'failed'
        payment.save()
    except PaymentRecord.DoesNotExist:
        pass


def payment_history(request):
    """Historique des paiements"""
    payments = PaymentRecord.objects.all().order_by('-created_at')
    return render(request, 'payment_history.html', {'payments': payments})

def handler404(request, exception):
    return render(request, '404.html', status=404)

#-------------------Authentification-------------------------------------------------------#
def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Inscription réussie ! Bienvenue parmi nous.')
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            next_url = request.GET.get('next', 'home')
            messages.success(request, f'Bon retour, {user.username} !')
            return redirect(next_url)
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, 'Vous êtes déconnecté.')
    return redirect('home')

@login_required
def profile(request):
    bookings = Booking.objects.filter(customer_email=request.user.email)
    payments = PaymentRecord.objects.filter(customer_email=request.user.email)
    return render(request, 'registration/profile.html', {
        'bookings': bookings,
        'payments': payments,
    })

#-------------------Blog-------------------------------------------------------#
def blog_list(request):
    articles = BlogPost.objects.filter(published=True)
    return render(request, 'blog/list.html', {'articles': articles})

def blog_detail(request, slug):
    article = get_object_or_404(BlogPost, slug=slug, published=True)
    recents = BlogPost.objects.filter(published=True).exclude(slug=slug)[:3]
    comments = article.comments.filter(active=True)
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = article
            comment.save()
            messages.success(request, _("Votre commentaire a été ajouté avec succès."))
            return redirect(reverse('blog_detail', kwargs={'slug': article.slug}) + '#comments')
        messages.error(request, _("Votre commentaire n'a pas pu être ajouté. Vérifiez les champs."))
    else:
        form = CommentForm()
    return render(request, 'blog/detail.html', {
        'article': article,
        'recents': recents,
        'comments': comments,
        'form': form,
    })

#-------------------Newsletter-------------------------------------------------------#
def newsletter_subscribe(request):
    if request.method == 'POST':
        email = request.POST.get('email', '')
        if email:
            NewsletterSubscriber.objects.get_or_create(email=email)
            messages.success(request, 'Merci pour votre inscription à notre newsletter !')
        else:
            messages.error(request, 'Veuillez entrer une adresse email valide.')
    return redirect(request.META.get('HTTP_REFERER', 'home'))

#-------------------Recherche destinations-------------------------------------------------------#
def search_destinations(request):
    query = request.GET.get('q', '')
    price_max = request.GET.get('price_max', '')
    destinations = Destination.objects.all()
    if query:
        destinations = destinations.filter(name__icontains=query) | destinations.filter(description__icontains=query)
    if price_max:
        destinations = destinations.filter(price__lte=price_max)
    return render(request, 'search.html', {
        'destinations': destinations,
        'query': query,
        'price_max': price_max,
    })

#-------------------Carte interactive-------------------------------------------------------#
def map_view(request):
    destinations = Destination.objects.all()
    circuits = pack_travel.objects.all()
    return render(request, 'map.html', {'destinations': destinations, 'circuits': circuits})

#-------------------Récap avant paiement-------------------------------------------------------#
@login_required
def booking_recap(request, destination_id):
    destination = get_object_or_404(Destination, id=destination_id)
    hotels = Hotel.objects.filter(destination=destination)
    return render(request, 'booking_recap.html', {
        'destination': destination,
        'hotels': hotels,
    })


def booking_confirmation(request, booking_id):
    """Page de confirmation affichée après la création d'une réservation.
    Affiche les détails de la réservation et un bouton pour lancer le paiement."""
    booking = get_object_or_404(Booking, id=booking_id)
    payment = PaymentRecord.objects.filter(booking=booking).first()

    # Vérifier si le paiement a déjà été effectué
    payment_done = payment and payment.status == 'completed'

    return render(request, 'booking_confirmation.html', {
        'booking': booking,
        'payment': payment,
        'payment_done': payment_done,
    })


def circuit_confirmation(request, circuit_booking_id):
    """Page de confirmation pour les réservations de circuits/croisières.
    Affiche les détails et un bouton pour lancer le paiement."""
    circuit_booking = get_object_or_404(reser_circuit, id=circuit_booking_id)
    payment = PaymentRecord.objects.filter(reser_circuit=circuit_booking).first()

    payment_done = payment and payment.status == 'completed'

    return render(request, 'circuit_confirmation.html', {
        'circuit_booking': circuit_booking,
        'payment': payment,
        'payment_done': payment_done,
    })

#-------------------Changement de langue-------------------------------------------------------#
def set_language(request, lang_code):
    response = redirect(request.META.get('HTTP_REFERER', 'home'))
    if lang_code in ['fr', 'en', 'ar']:
        activate(lang_code)
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang_code)
    return response

#-------------------API REST-------------------------------------------------------#
class IsAdminOrReadOnly(permissions.BasePermission):
    """Lecture publique ; écriture réservée au staff."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class IsAdminOrCreateOnly(permissions.BasePermission):
    """Création anonyme autorisée (formulaires publics) ; reste réservé au staff."""
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return bool(request.user and request.user.is_staff)


class IsAdminOrReadCreateOnly(permissions.BasePermission):
    """Lecture + création publiques ; modification/suppression réservées au staff."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True
        return bool(request.user and request.user.is_staff)


class IsStaffOrAuthenticatedOrCreateOnly(permissions.BasePermission):
    """Création publique (formulaires) ; lecture pour tout utilisateur connecté ;
    modification/suppression réservées au staff."""
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        if request.method in permissions.SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(request.user and request.user.is_staff)


class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [IsAdminOrReadOnly]

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [IsAdminOrReadOnly]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsStaffOrAuthenticatedOrCreateOnly]

class PackTravelViewSet(viewsets.ModelViewSet):
    queryset = pack_travel.objects.all()
    serializer_class = PackTravelSerializer
    permission_classes = [IsAdminOrReadOnly]

class ReserCircuitViewSet(viewsets.ModelViewSet):
    queryset = reser_circuit.objects.all()
    serializer_class = ReserCircuitSerializer   
    permission_classes = [IsStaffOrAuthenticatedOrCreateOnly]   
class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer    
    permission_classes = [IsAdminOrCreateOnly]

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadCreateOnly]

class PaymentRecordViewSet(viewsets.ModelViewSet):
    queryset = PaymentRecord.objects.all()
    serializer_class = PaymentRecordSerializer  
    permission_classes = [IsAdminOrReadOnly]

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAdminOrReadOnly]

class BlogCommentViewSet(viewsets.ModelViewSet):
    queryset = BlogComment.objects.all()
    serializer_class = BlogCommentSerializer
    permission_classes = [IsAdminOrReadCreateOnly]

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer   
    permission_classes = [IsAdminOrCreateOnly]   

