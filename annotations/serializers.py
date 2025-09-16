from rest_framework import serializers
from .models import Annotation, GalleryImage


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'description', 'image_url', 'thumbnail_url', 'source', 'category', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_image_url(self, value):
        """Validate that image_url is a valid URL"""
        if not value:
            raise serializers.ValidationError("Image URL is required")
        return value


class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = ['id', 'shape_type', 'coordinates', 'label', 'user_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_coordinates(self, value):
        """Validate that coordinates is a valid JSON array"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Coordinates must be a JSON array")
        return value
    
    def validate_shape_type(self, value):
        """Validate shape type"""
        valid_shapes = ['rectangle', 'circle', 'polygon', 'point']
        if value not in valid_shapes:
            raise serializers.ValidationError(f"Shape type must be one of: {valid_shapes}")
        return value
