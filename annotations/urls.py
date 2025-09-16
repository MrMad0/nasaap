from django.urls import path
from . import views

urlpatterns = [
    # Main pages
    path('', views.gallery, name='gallery'),
    path('viewer/', views.index, name='viewer'),
    
    # Gallery API endpoints
    path('api/gallery/', views.GalleryImageListCreateView.as_view(), name='gallery-list-create'),
    path('api/gallery/<int:pk>/', views.GalleryImageDetailView.as_view(), name='gallery-detail'),
    
    # Annotation API endpoints
    path('api/', views.AnnotationListCreateView.as_view(), name='annotation-list-create'),
    path('api/<int:pk>/', views.AnnotationDetailView.as_view(), name='annotation-detail'),
    
    # Function-based views (alternative)
    path('api/list/', views.annotation_list, name='annotation-list'),
    path('api/create/', views.annotation_create, name='annotation-create'),
    path('api/detail/<int:pk>/', views.annotation_detail, name='annotation-detail-func'),
]
