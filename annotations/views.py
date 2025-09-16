from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Annotation, GalleryImage
from .serializers import AnnotationSerializer, GalleryImageSerializer


def index(request):
    """Main page view for the NASA Image Explorer"""
    image_id = request.GET.get('image_id')
    selected_image = None
    
    if image_id:
        try:
            selected_image = GalleryImage.objects.get(id=image_id)
        except GalleryImage.DoesNotExist:
            pass
    
    return render(request, 'index.html', {'selected_image': selected_image})


def gallery(request):
    """Gallery page view"""
    return render(request, 'gallery.html')


class GalleryImageListCreateView(generics.ListCreateAPIView):
    """List all gallery images or create a new gallery image"""
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer


class GalleryImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a gallery image"""
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer


class AnnotationListCreateView(generics.ListCreateAPIView):
    """List all annotations or create a new annotation"""
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer


class AnnotationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an annotation"""
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer


@api_view(['GET'])
def annotation_list(request):
    """Simple list view for annotations"""
    annotations = Annotation.objects.all()
    serializer = AnnotationSerializer(annotations, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def annotation_create(request):
    """Create a new annotation"""
    serializer = AnnotationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def annotation_detail(request, pk):
    """Get a specific annotation by ID"""
    try:
        annotation = Annotation.objects.get(pk=pk)
        serializer = AnnotationSerializer(annotation)
        return Response(serializer.data)
    except Annotation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)