from rest_framework import serializers
from .models import Team, User, Workout, Activity, Leaderboard


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['_id', 'name', 'description', 'created_at', 'member_count']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'alias', 'email', 'team_id', 'power', 'fitness_level', 'joined_at']


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty', 'duration_minutes', 'calories_per_session', 'created_at']


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'workout_id', 'workout_name', 'duration_minutes', 'calories_burned', 'distance_km', 'activity_date', 'notes']


class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'user_name', 'user_alias', 'team_id', 'total_calories', 'total_workouts', 'total_minutes', 'total_distance_km', 'rank', 'last_updated']
