from django.http.response import HttpResponse
from django.shortcuts import render, get_object_or_404, HttpResponseRedirect
from django.db import IntegrityError
from django.http import JsonResponse
from .models import Election, Question, Response, Candidate
from .serializers import ResponseSerializer


def index(request):
  election = Election.objects.get(name="boulder")
  questions = election.question_election.all()

  context = {
    "election": election,
    "questions": questions,
  }

  return render(request, 'multi/index.html', context)

# response serializer test
def response(request, id):  
  try:
    response = Response.objects.get(pk=id)
  except Response.DoesNotExist:
    return HttpResponse(status=404)

  if request.method == 'GET':
    serializer = ResponseSerializer(response)
    return JsonResponse(serializer.data)
