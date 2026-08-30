from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import auth_api
from .views import contactcreteview, HomeView, temoignageView, temoignageViewV,circuitChoisiView
from .views import DestinationViewSet, HotelViewSet, BookingViewSet, PackTravelViewSet, ReserCircuitViewSet, ContactViewSet, TestimonialViewSet, PaymentRecordViewSet, BlogPostViewSet, BlogCommentViewSet, NewsletterSubscriberViewSet
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet)
router.register(r'hotels', HotelViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'packs', PackTravelViewSet)
router.register(r'reser-circuits', ReserCircuitViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'payment-records', PaymentRecordViewSet)
router.register(r'blog-posts', BlogPostViewSet)
router.register(r'blog-comments', BlogCommentViewSet)
router.register(r'newsletter-subscribers', NewsletterSubscriberViewSet)

urlpatterns = [
    #path('', views.home, name='home'),
    path('api/', include(router.urls)),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/auth/me/', auth_api.me, name='auth_me'),
    path('api/auth/login/', auth_api.api_login, name='auth_login'),
    path('api/auth/register/', auth_api.api_register, name='auth_register'),
    path('api/auth/logout/', auth_api.api_logout, name='auth_logout'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    path ('',HomeView.as_view(), name='home'),# variante HomeView de home 

    path('about/', views.about, name='about'), 

    #path('contact/', views.contact, name='contact'),
    path('contact/', contactcreteview.as_view(), name='contact'),# variante creteview de contact
    

    #path('temoignage/', views.temoignage, name='temoignage'),
    path('temoignage/', temoignageViewV.as_view(), name='temoignage'),# variante HomeView de home 

    path('testimonial_form/', temoignageView.as_view(), name='testimonial_form'),# variante creteview de contact
    path('circuit/', views.circuit, name='circuit'),
    path('croisiere/', views.croisiere, name='croisiere'),
    path('reselieuChoisi/<int:destination_id>/', views.reselieuChoisi, name='reselieuChoisi'),

    #path('circuitChoisi/<int:pack_travel_id>/', views.circuitChoisi, name='circuitChoisi'),
    path('circuitChoisi/<int:pk>/', circuitChoisiView.as_view(), name='circuitChoisi'),

    path('reservCroisiere/<int:pack_travel_id>/', views.reservCroisiere, name='reservCroisiere'),
    
    # Paiement Stripe
    path('payment/', views.payment_home, name='payment_home'),
    path('payment/checkout/destination/<int:destination_id>/', views.create_checkout_destination, name='checkout_destination'),
    path('payment/checkout/pack/<int:pack_id>/', views.create_checkout_pack, name='checkout_pack'),
    path('payment/success/', views.payment_success, name='payment_success'),
    path('payment/cancel/', views.payment_cancel, name='payment_cancel'),
    path('payment/webhook/', views.stripe_webhook, name='stripe_webhook'),
    path('history/', views.payment_history, name='payment_history'),
    path('currency/', views.convertir_devise, name='currency'),
    path('api/historical-rates/', views.historical_rates_api, name='historical_rates_api'),
    path('api/rates/', views.latest_rates_api, name='latest_rates_api'),

    # Authentification
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),

    # Blog
    path('blog/', views.blog_list, name='blog_list'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),

    # Newsletter
    path('newsletter/subscribe/', views.newsletter_subscribe, name='newsletter_subscribe'),

    # Recherche
    path('search/', views.search_destinations, name='search'),

    # Carte interactive
    path('map/', views.map_view, name='map'),

    # Récap avant paiement
    path('booking/recap/<int:destination_id>/', views.booking_recap, name='booking_recap'),

    # Confirmation de réservation + paiement
    path('booking/confirmation/<int:booking_id>/', views.booking_confirmation, name='booking_confirmation'),
    path('circuit/confirmation/<int:circuit_booking_id>/', views.circuit_confirmation, name='circuit_confirmation'),

    # Changement de langue
    path('lang/<str:lang_code>/', views.set_language, name='set_language'),
]
