from django.db import models
from django import forms
from django.forms import ModelForm
from django.utils.translation import gettext_lazy as _
from .models import Contact, BlogComment

"""class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['name', 'email', 'phone', 'date', 'time', 'number_of_people']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'time': forms.TimeInput(attrs={'type': 'time'}),
        }"""

class ContactForm(ModelForm):
    class Meta:
        model = Contact
        fields =('name','phone', 'email', 'message')
        labels = {
            'name': 'Nom',
            'phone': 'Téléphone',
            'email': 'Email',
            'message': 'Message',
        }
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Votre nom'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Votre téléphone'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Votre email'}),
            'message': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Votre message', 'rows': 5}),
        }

class CommentForm(ModelForm):
    class Meta:
        model = BlogComment
        fields = ('author', 'email', 'body')
        labels = {
            'author': _('Nom'),
            'email': _('Email'),
            'body': _('Commentaire'),
        }
        widgets = {
            'author': forms.TextInput(attrs={'class': 'form-control', 'placeholder': _('Votre nom')}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': _('Votre email')}),
            'body': forms.Textarea(attrs={'class': 'form-control', 'placeholder': _('Votre commentaire…'), 'rows': 4}),
        }