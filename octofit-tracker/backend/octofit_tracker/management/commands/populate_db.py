from django.core.management.base import BaseCommand
from pymongo import MongoClient
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        self.stdout.write(self.style.SUCCESS('Starting database population...'))

        # Clear existing data
        self.stdout.write('Clearing existing collections...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Create unique index on email field
        self.stdout.write('Creating unique index on email field...')
        db.users.create_index([('email', 1)], unique=True)

        # Insert teams
        self.stdout.write('Inserting teams...')
        teams_data = [
            {
                '_id': 'team_marvel',
                'name': 'Team Marvel',
                'description': 'Earth\'s Mightiest Heroes',
                'created_at': datetime.now().isoformat(),
                'member_count': 0
            },
            {
                '_id': 'team_dc',
                'name': 'Team DC',
                'description': 'Justice League United',
                'created_at': datetime.now().isoformat(),
                'member_count': 0
            }
        ]
        db.teams.insert_many(teams_data)

        # Insert users (superheroes)
        self.stdout.write('Inserting users...')
        marvel_heroes = [
            {'name': 'Tony Stark', 'alias': 'Iron Man', 'email': 'ironman@marvel.com', 'power': 'Technology'},
            {'name': 'Steve Rogers', 'alias': 'Captain America', 'email': 'cap@marvel.com', 'power': 'Super Soldier'},
            {'name': 'Thor Odinson', 'alias': 'Thor', 'email': 'thor@asgard.com', 'power': 'Thunder God'},
            {'name': 'Natasha Romanoff', 'alias': 'Black Widow', 'email': 'blackwidow@marvel.com', 'power': 'Espionage'},
            {'name': 'Bruce Banner', 'alias': 'Hulk', 'email': 'hulk@marvel.com', 'power': 'Super Strength'},
        ]

        dc_heroes = [
            {'name': 'Clark Kent', 'alias': 'Superman', 'email': 'superman@dc.com', 'power': 'Flight'},
            {'name': 'Bruce Wayne', 'alias': 'Batman', 'email': 'batman@dc.com', 'power': 'Intelligence'},
            {'name': 'Diana Prince', 'alias': 'Wonder Woman', 'email': 'wonderwoman@dc.com', 'power': 'Super Strength'},
            {'name': 'Barry Allen', 'alias': 'Flash', 'email': 'flash@dc.com', 'power': 'Super Speed'},
            {'name': 'Arthur Curry', 'alias': 'Aquaman', 'email': 'aquaman@dc.com', 'power': 'Aquatic'},
        ]

        users_data = []
        for hero in marvel_heroes:
            users_data.append({
                'name': hero['name'],
                'alias': hero['alias'],
                'email': hero['email'],
                'team_id': 'team_marvel',
                'power': hero['power'],
                'fitness_level': random.randint(50, 100),
                'joined_at': datetime.now().isoformat()
            })

        for hero in dc_heroes:
            users_data.append({
                'name': hero['name'],
                'alias': hero['alias'],
                'email': hero['email'],
                'team_id': 'team_dc',
                'power': hero['power'],
                'fitness_level': random.randint(50, 100),
                'joined_at': datetime.now().isoformat()
            })

        result = db.users.insert_many(users_data)
        user_ids = result.inserted_ids

        # Update team member counts
        db.teams.update_one({'_id': 'team_marvel'}, {'$set': {'member_count': len(marvel_heroes)}})
        db.teams.update_one({'_id': 'team_dc'}, {'$set': {'member_count': len(dc_heroes)}})

        # Insert workouts
        self.stdout.write('Inserting workouts...')
        workout_types = [
            {'name': 'Power Training', 'description': 'Strength and power exercises', 'difficulty': 'Hard', 'duration': 60},
            {'name': 'Speed Work', 'description': 'Agility and speed drills', 'difficulty': 'Medium', 'duration': 45},
            {'name': 'Endurance Run', 'description': 'Long distance running', 'difficulty': 'Medium', 'duration': 90},
            {'name': 'Combat Training', 'description': 'Hand-to-hand combat practice', 'difficulty': 'Hard', 'duration': 75},
            {'name': 'Flexibility Yoga', 'description': 'Stretching and balance', 'difficulty': 'Easy', 'duration': 30},
        ]

        workouts_data = []
        for workout in workout_types:
            workouts_data.append({
                'name': workout['name'],
                'description': workout['description'],
                'difficulty': workout['difficulty'],
                'duration_minutes': workout['duration'],
                'calories_per_session': random.randint(200, 800),
                'created_at': datetime.now().isoformat()
            })

        workout_result = db.workouts.insert_many(workouts_data)
        workout_ids = workout_result.inserted_ids

        # Insert activities
        self.stdout.write('Inserting activities...')
        activities_data = []
        for user_id in user_ids:
            # Generate 3-7 activities per user
            num_activities = random.randint(3, 7)
            for i in range(num_activities):
                workout_id = random.choice(workout_ids)
                workout = db.workouts.find_one({'_id': workout_id})
                days_ago = random.randint(0, 30)
                activity_date = datetime.now() - timedelta(days=days_ago)
                
                activities_data.append({
                    'user_id': user_id,
                    'workout_id': workout_id,
                    'workout_name': workout['name'],
                    'duration_minutes': workout['duration_minutes'],
                    'calories_burned': workout['calories_per_session'] + random.randint(-50, 50),
                    'distance_km': round(random.uniform(1.0, 15.0), 2) if 'Run' in workout['name'] else 0,
                    'activity_date': activity_date.isoformat(),
                    'notes': f"Great {workout['name'].lower()} session!"
                })

        db.activities.insert_many(activities_data)

        # Calculate and insert leaderboard
        self.stdout.write('Calculating leaderboard...')
        leaderboard_data = []
        
        for user_id in user_ids:
            user = db.users.find_one({'_id': user_id})
            user_activities = list(db.activities.find({'user_id': user_id}))
            
            total_calories = sum(activity['calories_burned'] for activity in user_activities)
            total_workouts = len(user_activities)
            total_minutes = sum(activity['duration_minutes'] for activity in user_activities)
            total_distance = sum(activity.get('distance_km', 0) for activity in user_activities)
            
            leaderboard_data.append({
                'user_id': user_id,
                'user_name': user['name'],
                'user_alias': user['alias'],
                'team_id': user['team_id'],
                'total_calories': total_calories,
                'total_workouts': total_workouts,
                'total_minutes': total_minutes,
                'total_distance_km': round(total_distance, 2),
                'rank': 0,  # Will be updated after sorting
                'last_updated': datetime.now().isoformat()
            })

        # Sort by total calories and assign ranks
        leaderboard_data.sort(key=lambda x: x['total_calories'], reverse=True)
        for idx, entry in enumerate(leaderboard_data, 1):
            entry['rank'] = idx

        db.leaderboard.insert_many(leaderboard_data)

        # Print summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(f'Teams: {db.teams.count_documents({})}')
        self.stdout.write(f'Users: {db.users.count_documents({})}')
        self.stdout.write(f'Workouts: {db.workouts.count_documents({})}')
        self.stdout.write(f'Activities: {db.activities.count_documents({})}')
        self.stdout.write(f'Leaderboard Entries: {db.leaderboard.count_documents({})}')
        
        self.stdout.write(self.style.SUCCESS('\nDatabase successfully populated with superhero test data!'))
