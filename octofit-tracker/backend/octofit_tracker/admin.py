from django.contrib import admin
from .models import Team, User, Workout, Activity, Leaderboard


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'member_count', 'created_at']
    search_fields = ['name', '_id']
    list_filter = ['created_at']


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'alias', 'name', 'email', 'team_id', 'power', 'fitness_level', 'joined_at']
    search_fields = ['name', 'alias', 'email']
    list_filter = ['team_id', 'power', 'joined_at']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'difficulty', 'duration_minutes', 'calories_per_session', 'created_at']
    search_fields = ['name']
    list_filter = ['difficulty', 'created_at']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['id', 'workout_name', 'user_id', 'duration_minutes', 'calories_burned', 'distance_km', 'activity_date']
    search_fields = ['workout_name', 'user_id']
    list_filter = ['workout_name', 'activity_date']
    date_hierarchy = 'activity_date'


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['rank', 'user_alias', 'user_name', 'team_id', 'total_calories', 'total_workouts', 'total_minutes', 'total_distance_km']
    search_fields = ['user_name', 'user_alias']
    list_filter = ['team_id', 'last_updated']
    ordering = ['rank']
