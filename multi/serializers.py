from rest_framework import serializers
from multi.models import Response 


class ResponseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Response 
    fields = '__all__'
    depth = 1





