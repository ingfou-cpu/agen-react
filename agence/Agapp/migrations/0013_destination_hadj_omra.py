# Migration de données : ajout des destinations Hadj et Omra (La Mecque).
# Images (licences libres CC) :
#   - la-mecque-hadj.jpg : "Millions Perform Prayer at the Grand Mosque, Makkah,
#     Saudi Arabia (2026)" — CC BY-SA 4.0 (Wikimedia Commons, curid 186866449)
#   - la-mecque-omra.jpg : "The Kabah in the Grand Mosque of Makkah, Saudi Arabia
#     (52501405646)" — CC BY 2.0 (Wikimedia Commons, curid 148989886)

from django.db import migrations


def add_hadj_omra(apps, schema_editor):
    Destination = apps.get_model('Agapp', 'Destination')
    Destination.objects.get_or_create(
        name="Le Hadj à La Mecque",
        defaults={
            'price': 4500.00,
            'city_name': 'La Mecque',
            'description': (
                "Pèlerinage du Hadj à La Mecque (Makkah) : séjour de 12 jours en "
                "pension complète, hébergement à proximité de la Mosquée Sacrée "
                "(Al-Masjid al-Haram), accompagnement par un guide francophone et "
                "encadrement religieux pour accomplir les rites du pèlerinage dans "
                "les meilleures conditions."
            ),
            'image': 'destination_images/la-mecque-hadj.jpg',
            'latitude': 21.4225,
            'longitude': 39.8262,
        },
    )
    Destination.objects.get_or_create(
        name="L'Omra à La Mecque",
        defaults={
            'price': 2500.00,
            'city_name': 'La Mecque',
            'description': (
                "Omra à La Mecque (Makkah) : formule flexible de 7 à 10 jours, "
                "hébergement proche de la Kaaba, transferts et visas organisés, "
                "avec une extension optionnelle vers Médine (Al-Madinah) pour "
                "visiter la Mosquée du Prophète."
            ),
            'image': 'destination_images/la-mecque-omra.jpg',
            'latitude': 21.4225,
            'longitude': 39.8262,
        },
    )


def remove_hadj_omra(apps, schema_editor):
    Destination = apps.get_model('Agapp', 'Destination')
    Destination.objects.filter(name__in=["Le Hadj à La Mecque", "L'Omra à La Mecque"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('Agapp', '0012_blogcomment'),
    ]

    operations = [
        migrations.RunPython(add_hadj_omra, remove_hadj_omra),
    ]
