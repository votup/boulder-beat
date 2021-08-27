from django.urls import path
from django.conf import settings
from . import views

app_name = 'multi'
urlpatterns = [
    path('', views.index, name='index'),
    path('response/<int:id>', views.response, name="response")
]
