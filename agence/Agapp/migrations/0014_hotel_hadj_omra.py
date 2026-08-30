# Migration de données : ajout d'hôtels pour les destinations Hadj et Omra.
# Images (licences libres CC) :
#   - fairmont-makkah.jpg : "Abraj-al-Bait largest clock tower ever" — CC BY-SA 4.0
#   - al-reyadah-makkah.jpg : "Al Reyadah Grand Hotel" — CC BY-SA 3.0
#   - asala-makkah.jpg : "Assala Makkah Hotel" — CC BY-SA 3.0

from django.db import migrations


HOTELS = [
    {
        'hotel_name': 'Fairmont Makkah Clock Royal Tower',
        'description': (
            'Hôtel 5★ situé dans la tour Horloge Abraj Al Bait, à quelques pas '
            'de la Mosquée Sacrée. Vue imprenable sur la Kaaba, chambres de luxe, '
            'restaurants gastronomiques et services haut de gamme. Idéal pour un '
            'séjour mémorable lors du Hadj ou de l\'Omra.'
        ),
        'calification_stars': 5,
        'price': 350.00,
        'image': 'hotel_images/fairmont-makkah.jpg',
    },
    {
        'hotel_name': 'Al Reyadah Grand Hotel',
        'description': (
            'Hôtel 4★ de bon standing situé sur Ibrahim Khalil Road, à proximité '
            'immédiate de Al-Masjid al-Haram. Chambres climatisées avec vue sur '
            'la ville sainte, petit-déjeuner inclus, idéal pour un rapport '
            'qualité-prix excellent.'
        ),
        'calification_stars': 4,
        'price': 180.00,
        'image': 'hotel_images/al-reyadah-makkah.jpg',
    },
    {
        'hotel_name': 'Assala Makkah Hotel',
        'description': (
            'Hôtel 3★ bien situé près de la Grande Mosquée, offrant des '
            'chambres propres et confortables à prix abordable. Idéal pour les '
            'pèlerins souhaitant un hébergement fonctionnel et proche des lieux saints.'
        ),
        'calification_stars': 3,
        'price': 90.00,
        'image': 'hotel_images/asala-makkah.jpg',
    },
]


def add_hotels(apps, schema_editor):
    Hotel = apps.get_model('Agapp', 'Hotel')
    Destination = apps.get_model('Agapp', 'Destination')

    # Associer chaque hôtel aux deux destinations Hadj et Omra
    for dest_name in ("Le Hadj à La Mecque", "L'Omra à La Mecque"):
        try:
            dest = Destination.objects.get(name=dest_name)
        except Destination.DoesNotExist:
            continue

        for h in HOTELS:
            Hotel.objects.get_or_create(
                hotel_name=h['hotel_name'],
                destination=dest,
                defaults={
                    'description': h['description'],
                    'calification_stars': h['calification_stars'],
                    'price': h['price'],
                    'image': h['image'],
                    'reservation_link': '',
                    'status': True,
                },
            )


def remove_hotels(apps, schema_editor):
    Hotel = apps.get_model('Agapp', 'Hotel')
    names = [h['hotel_name'] for h in HOTELS]
    Hotel.objects.filter(hotel_name__in=names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('Agapp', '0013_destination_hadj_omra'),
    ]

    operations = [
        migrations.RunPython(add_hotels, remove_hotels),
    ]
