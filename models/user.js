const mongoose = require('mongoose');

const workoutSchema= mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  muscleGroup: {
    type: String,
    enum: [
      'Chest',
      'Back',
      'Quads',
      'Hamstrings',
      'Calves',
      'Shoulders',
      'Core',
      'Biceps',
      'Triceps',
      'Other',
    ],
  },
  exercise: {
    type: String
  },
  weight: {
    type: Number
  },
  sets: {
    type: Number
  },
  repGoal: {
    type: Number
  },
  actualReps: {
    type: Number
  },
  intensity: {
    type: Number
  },
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  workouts: [workoutSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
