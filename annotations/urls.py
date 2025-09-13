from django.urls import path
from . import views

urlpatterns = [
    # Class-based views
    path('', views.AnnotationListCreateView.as_view(), name='annotation-list-create'),
    path('<int:pk>/', views.AnnotationDetailView.as_view(), name='annotation-detail'),
    
    # Function-based views (alternative)
    path('list/', views.annotation_list, name='annotation-list'),
    path('create/', views.annotation_create, name='annotation-create'),
    path('detail/<int:pk>/', views.annotation_detail, name='annotation-detail-func'),
]
