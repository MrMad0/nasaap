from django.db import models
from django.contrib.auth.models import User


class Annotation(models.Model):
    SHAPE_CHOICES = [
        ('rectangle', 'Rectangle'),
        ('circle', 'Circle'),
        ('polygon', 'Polygon'),
        ('point', 'Point'),
    ]
    
    id = models.AutoField(primary_key=True)
    shape_type = models.CharField(max_length=20, choices=SHAPE_CHOICES, default='rectangle')
    coordinates = models.JSONField(help_text="JSON array of coordinate points")
    label = models.CharField(max_length=200, help_text="Annotation label/description")
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.shape_type}: {self.label}"