# Dockerfile

# pull base img
FROM python:3.8

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set work dir
WORKDIR /code

# install dependencies 
RUN pip install pipenv
COPY Pipfile Pipfile.lock /code/
RUN pipenv install --system

# copy project 
COPY . /code/
