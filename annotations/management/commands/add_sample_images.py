from django.core.management.base import BaseCommand
from annotations.models import GalleryImage


class Command(BaseCommand):
    help = 'Add sample NASA images to the gallery'

    def handle(self, *args, **options):
        sample_images = [
            {
                'title': 'Earth from Space - Blue Marble',
                'description': 'This spectacular "blue marble" image is the most detailed true-color image of the entire Earth to date. Using a collection of satellite-based observations, scientists and visualizers stitched together months of observations of the land surface, oceans, sea ice, and clouds into a seamless, true-color mosaic of every square kilometer of our planet.',
                'image_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/blue_marble_2012.png',
                'thumbnail_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/blue_marble_2012.png',
                'source': 'NASA',
                'category': 'Earth'
            },
            {
                'title': 'Mars Perseverance Rover Landing Site',
                'description': 'This image shows the landscape surrounding NASA\'s Perseverance rover after it landed in Jezero Crater on Mars. The image was taken by the rover\'s navigation cameras and shows the rocky, desert-like terrain that the rover will explore as it searches for signs of ancient microbial life.',
                'image_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/mars_perseverance_landing_site.jpg',
                'thumbnail_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/mars_perseverance_landing_site.jpg',
                'source': 'NASA',
                'category': 'Mars'
            },
            {
                'title': 'Hubble Deep Field - Galaxies',
                'description': 'One of the most important images in astronomy, the Hubble Deep Field shows thousands of galaxies in a tiny patch of sky. This image revolutionized our understanding of the early universe and showed that galaxies formed much earlier than previously thought. Each point of light in this image is an entire galaxy containing billions of stars.',
                'image_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/hubble_deep_field.jpg',
                'thumbnail_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/hubble_deep_field.jpg',
                'source': 'NASA',
                'category': 'Space'
            },
            {
                'title': 'International Space Station',
                'description': 'The International Space Station (ISS) as seen from a distance, showing its distinctive solar panels and modular structure. The ISS orbits Earth at an altitude of approximately 400 kilometers and serves as a platform for scientific research and international cooperation in space exploration.',
                'image_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/iss_external_view.jpg',
                'thumbnail_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/iss_external_view.jpg',
                'source': 'NASA',
                'category': 'Satellites'
            },
            {
                'title': 'Saturn with Rings',
                'description': 'A stunning view of Saturn captured by the Cassini spacecraft, showing the planet\'s distinctive ring system in beautiful detail. Saturn\'s rings are made up of countless particles of ice and rock, ranging in size from tiny grains to house-sized chunks. This image showcases the incredible beauty and complexity of our solar system.',
                'image_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/saturn_cassini.jpg',
                'thumbnail_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/saturn_cassini.jpg',
                'source': 'NASA',
                'category': 'Space'
            },
            {
                'title': 'Moon Surface - Apollo Mission',
                'description': 'This iconic image from the Apollo missions shows the lunar surface in stunning detail. The cratered landscape tells the story of billions of years of impacts from asteroids and comets. The lack of atmosphere on the Moon means that these craters are preserved perfectly, providing a window into the early history of our solar system.',
                'image_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/apollo_moon_surface.jpg',
                'thumbnail_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/apollo_moon_surface.jpg',
                'source': 'NASA',
                'category': 'Moon'
            },
            {
                'title': 'Nebula - Star Formation Region',
                'description': 'This colorful image shows a star-forming region in a distant nebula. The bright colors represent different gases heated by young, hot stars. These stellar nurseries are where new stars are born from clouds of gas and dust. The intricate structures are shaped by stellar winds and radiation from the newborn stars.',
                'image_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/nebula_star_formation.jpg',
                'thumbnail_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/nebula_star_formation.jpg',
                'source': 'NASA',
                'category': 'Space'
            },
            {
                'title': 'Earth Aurora from Space',
                'description': 'A breathtaking view of Earth\'s aurora as seen from the International Space Station. The green curtains of light are created when charged particles from the Sun interact with Earth\'s magnetic field and atmosphere. This natural light show is one of the most beautiful phenomena visible from space.',
                'image_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/earth_aurora_iss.jpg',
                'thumbnail_url': 'https://www.nasa.gov/wp-content/uploads/2023/03/earth_aurora_iss.jpg',
                'source': 'NASA',
                'category': 'Earth'
            }
        ]

        created_count = 0
        for image_data in sample_images:
            # Check if image already exists
            if not GalleryImage.objects.filter(title=image_data['title']).exists():
                GalleryImage.objects.create(**image_data)
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created image: {image_data["title"]}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Image already exists: {image_data["title"]}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Created {created_count} new images. Total images in gallery: {GalleryImage.objects.count()}')
        )