from djongo import models
from django.utils import timezone


class Team(models.Model):
    _id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    member_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class User(models.Model):
    name = models.CharField(max_length=200)
    alias = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    team_id = models.CharField(max_length=100)
    power = models.CharField(max_length=200)
    fitness_level = models.IntegerField()
    joined_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.alias} ({self.name})"


class Workout(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=50)
    duration_minutes = models.IntegerField()
    calories_per_session = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name


class Activity(models.Model):
    user_id = models.CharField(max_length=100)
    workout_id = models.CharField(max_length=100)
    workout_name = models.CharField(max_length=200)
    duration_minutes = models.IntegerField()
    calories_burned = models.IntegerField()
    distance_km = models.FloatField(default=0.0)
    activity_date = models.DateTimeField()
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'activities'
        ordering = ['-activity_date']

    def __str__(self):
        return f"{self.workout_name} - {self.activity_date}"


class Leaderboard(models.Model):
    user_id = models.CharField(max_length=100)
    user_name = models.CharField(max_length=200)
    user_alias = models.CharField(max_length=200)
    team_id = models.CharField(max_length=100)
    total_calories = models.IntegerField()
    total_workouts = models.IntegerField()
    total_minutes = models.IntegerField()
    total_distance_km = models.FloatField()
    rank = models.IntegerField()
    last_updated = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'leaderboard'
        ordering = ['rank']

    def __str__(self):
        return f"{self.rank}. {self.user_alias} - {self.total_calories} calories"
