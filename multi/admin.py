from django.contrib import admin
from .models import Election, Question, Response, Candidate

@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
  list_display = ['__str__']
  ordering = ['f_name']

class ResponseInline(admin.StackedInline):
  model = Response
  list_display = ['__str__']

class QuestionAdmin(admin.ModelAdmin):
  model = Question
  list_display = ['phrase']
  inlines = [ResponseInline]

class ElectionAdmin(admin.ModelAdmin):
  list_display = ['name']

admin.site.register(Response)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Election)
