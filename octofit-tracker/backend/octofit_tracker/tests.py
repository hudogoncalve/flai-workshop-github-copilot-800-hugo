from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Team, User, Workout, Activity, Leaderboard
from datetime import datetime


class TeamModelTest(TestCase):
    """Test cases for the Team model."""

    def setUp(self):
        self.team = Team.objects.create(
            _id='test_team',
            name='Test Team',
            description='A test team',
            member_count=0
        )

    def test_team_creation(self):
        """Test that a team can be created."""
        self.assertEqual(self.team.name, 'Test Team')
        self.assertEqual(self.team._id, 'test_team')

    def test_team_str(self):
        """Test the string representation of a team."""
        self.assertEqual(str(self.team), 'Test Team')


class UserModelTest(TestCase):
    """Test cases for the User model."""

    def setUp(self):
        self.user = User.objects.create(
            name='Peter Parker',
            alias='Spider-Man',
            email='spiderman@marvel.com',
            team_id='team_marvel',
            power='Web-Slinging',
            fitness_level=90
        )

    def test_user_creation(self):
        """Test that a user can be created."""
        self.assertEqual(self.user.name, 'Peter Parker')
        self.assertEqual(self.user.alias, 'Spider-Man')
        self.assertEqual(self.user.email, 'spiderman@marvel.com')

    def test_user_str(self):
        """Test the string representation of a user."""
        self.assertEqual(str(self.user), 'Spider-Man (Peter Parker)')


class WorkoutModelTest(TestCase):
    """Test cases for the Workout model."""

    def setUp(self):
        self.workout = Workout.objects.create(
            name='Test Workout',
            description='A test workout',
            difficulty='Medium',
            duration_minutes=30,
            calories_per_session=250
        )

    def test_workout_creation(self):
        """Test that a workout can be created."""
        self.assertEqual(self.workout.name, 'Test Workout')
        self.assertEqual(self.workout.difficulty, 'Medium')

    def test_workout_str(self):
        """Test the string representation of a workout."""
        self.assertEqual(str(self.workout), 'Test Workout')


class ActivityModelTest(TestCase):
    """Test cases for the Activity model."""

    def setUp(self):
        self.activity = Activity.objects.create(
            user_id='123',
            workout_id='456',
            workout_name='Running',
            duration_minutes=45,
            calories_burned=400,
            distance_km=5.5,
            activity_date=datetime.now(),
            notes='Great run!'
        )

    def test_activity_creation(self):
        """Test that an activity can be created."""
        self.assertEqual(self.activity.workout_name, 'Running')
        self.assertEqual(self.activity.calories_burned, 400)


class LeaderboardModelTest(TestCase):
    """Test cases for the Leaderboard model."""

    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user_id='123',
            user_name='Peter Parker',
            user_alias='Spider-Man',
            team_id='team_marvel',
            total_calories=5000,
            total_workouts=20,
            total_minutes=600,
            total_distance_km=25.5,
            rank=1
        )

    def test_leaderboard_creation(self):
        """Test that a leaderboard entry can be created."""
        self.assertEqual(self.entry.user_alias, 'Spider-Man')
        self.assertEqual(self.entry.rank, 1)


class TeamAPITest(APITestCase):
    """Test cases for the Team API endpoints."""

    def setUp(self):
        self.team = Team.objects.create(
            _id='test_team',
            name='Test Team',
            description='A test team',
            member_count=0
        )

    def test_get_teams(self):
        """Test retrieving the list of teams."""
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_team_detail(self):
        """Test retrieving a single team."""
        url = reverse('team-detail', args=[self.team._id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Team')


class UserAPITest(APITestCase):
    """Test cases for the User API endpoints."""

    def setUp(self):
        self.user = User.objects.create(
            name='Peter Parker',
            alias='Spider-Man',
            email='spiderman@marvel.com',
            team_id='team_marvel',
            power='Web-Slinging',
            fitness_level=90
        )

    def test_get_users(self):
        """Test retrieving the list of users."""
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_get_user_detail(self):
        """Test retrieving a single user."""
        url = reverse('user-detail', args=[self.user.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['alias'], 'Spider-Man')


class WorkoutAPITest(APITestCase):
    """Test cases for the Workout API endpoints."""

    def setUp(self):
        self.workout = Workout.objects.create(
            name='Test Workout',
            description='A test workout',
            difficulty='Medium',
            duration_minutes=30,
            calories_per_session=250
        )

    def test_get_workouts(self):
        """Test retrieving the list of workouts."""
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)


class ActivityAPITest(APITestCase):
    """Test cases for the Activity API endpoints."""

    def setUp(self):
        self.activity = Activity.objects.create(
            user_id='123',
            workout_id='456',
            workout_name='Running',
            duration_minutes=45,
            calories_burned=400,
            distance_km=5.5,
            activity_date=datetime.now(),
            notes='Great run!'
        )

    def test_get_activities(self):
        """Test retrieving the list of activities."""
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)


class LeaderboardAPITest(APITestCase):
    """Test cases for the Leaderboard API endpoints."""

    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user_id='123',
            user_name='Peter Parker',
            user_alias='Spider-Man',
            team_id='team_marvel',
            total_calories=5000,
            total_workouts=20,
            total_minutes=600,
            total_distance_km=25.5,
            rank=1
        )

    def test_get_leaderboard(self):
        """Test retrieving the leaderboard."""
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)
