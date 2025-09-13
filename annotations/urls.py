from django.urls import path
from . import views

urlpatterns = [
    # Main page
    path('', views.index, name='index'),
    
    # API endpoints
    path('api/', views.AnnotationListCreateView.as_view(), name='annotation-list-create'),
    path('api/<int:pk>/', views.AnnotationDetailView.as_view(), name='annotation-detail'),
    
    # Function-based views (alternative)
    path('api/list/', views.annotation_list, name='annotation-list'),
    path('api/create/', views.annotation_create, name='annotation-create'),
    path('api/detail/<int:pk>/', views.annotation_detail, name='annotation-detail-func'),
]
