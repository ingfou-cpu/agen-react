# mon_application/serializers.py
from rest_framework import serializers
from .models import Destination, Hotel ,Booking,pack_travel,reser_circuit,Contact,Testimonial,PaymentRecord,BlogPost,BlogComment,NewsletterSubscriber # Remplacez par votre modèle existant

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('id', 'check_in_date')

class PackTravelSerializer(serializers.ModelSerializer):
    class Meta:
        model = pack_travel
        fields = '__all__'

class ReserCircuitSerializer(serializers.ModelSerializer):
    class Meta:
        model = reser_circuit
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class PaymentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRecord
        fields = '__all__'
        read_only_fields = (
            'id',
            'user',
            'stripe_checkout_session_id',
            'stripe_payment_intent_id',
            'stripe_customer_id',
            'status',
            'created_at',
            'updated_at',
        )

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'

class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = '__all__'

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'
