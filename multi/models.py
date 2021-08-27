from django.db import models
from django.utils.text import slugify


class Election(models.Model):
  name = models.CharField(max_length=250, blank=True, null=True, default='')
  slug = models.SlugField(default='', blank=True, null=True)

  def __str__(self):
    return self.name


class Candidate(models.Model):
  f_name = models.CharField(max_length=60, blank=True, null=True)
  l_name = models.CharField(max_length=60, blank=True, null=True)
  profile_photo = models.ImageField(upload_to='multi', blank=True, null=True)
  website = models.URLField(max_length=250, blank=True, null=True, default='')

  def __str__(self):
    return f'{self.f_name} {self.l_name}'

  def image_path(self):
    return f'/media/{self.profile_photo.name}'


class Question(models.Model):
  election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='question_election')
  phrase = models.CharField(max_length=250, blank=True, null=True)

  def __str__(self):
    return self.phrase


class Response(models.Model):
  question = models.ForeignKey(
      Question, on_delete=models.CASCADE, related_name='response_question')
  phrase = models.CharField(
      max_length=250, blank=True, null=True, default='')
  candidate = models.ManyToManyField(
      Candidate, blank=True, default='', related_name='response_candidate')

  def __str__(self):
    return f'{self.question} {self.phrase}'