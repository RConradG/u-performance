const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// helper arrow function that prints the caught error
const printError = error => {
  console.error(error);
  res.redirect('/');
};

const formatWorkoutsDates = (workouts) => {
  return workouts.map(workout => ({
    ...workout.toObject(),
    date: workout.date ? workout.date.toISOString().split('T')[0] : '', // extract YYY-MM-DD
  }));
}

const formatWorkoutDate = (meal) => {
  return {
    ...workout.toObject(),
    date: workout.date ? workout.date.toISOString().split('T')[0] : '', // extract YYY-MM-DD
  };
};

// TODO: have to formate workouts and workout to display Date only, not time


/* ----------------------------------- ROUTERS------------------------------------------ */
// 'starting' endpoint, already here: /users/:userId/workouts 

router.get('/new', async (req, res) => {
  try {
    res.render('workouts/new.ejs');
  } catch (error) {
    
  };
});

// GET /users/:userId/workouts/:workoutId/edit
router.get('/:workoutId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workoutToEdit = currentUser.workouts.id(req.params.workoutId);
    res.render('workouts/edit.ejs', {
      workout: workoutToEdit,
    });
  } catch (error) {
    printError(error);
  }
});

// GET /user/:userId/workouts/:workoutId
router.put('/:workoutId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workoutToUpdate = currentUser.workouts.id(req.params.workoutId);

    workoutToUpdate.set(req.body);
    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/workouts/${workoutToUpdate._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).redirect('/');
  }
});

// GET /users/:userId/workouts/:workoutId
router.get('/:workoutId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workout = currentUser.workouts.id(req.params.workoutId);
    if (!currentUser) {
      return res.status(404).send('User not found');
    }
    res.render('workouts/show.ejs', {
      workout: workout,
    });
  } catch (error) {
    console.error('Error fetching user', error);
    res.status(500).redirect('/');
  }
});

// GET /users/:userId/workouts
router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const sortedByDateWorkouts = currentUser.workouts.sort( (a, b) => b.date - a.date);
    res.render('workouts/index.ejs', {
      workouts: sortedByDateWorkouts,
    });
  } catch (error) {
    printError(error);
  }
});

// POST /users/:userId/workouts/:workoutId/add-exercise <- adds workout
router.post('/:userId/workouts/:workoutId/add-exercise', async (req, res) => {
  try {
    // Get the current user and workout
    const currentUser = await User.findById(req.params.userId);
    const workout = currentUser.workouts.id(req.params.workoutId);

    // Create the new exercise object
    const newExercise = {
      muscleGroup: req.body.muscleGroup,
      exercise: req.body.exercise,
      weight: req.body.weight,
      sets: req.body.sets,
      repGoal: req.body.repGoal,
      actualReps: req.body.actualReps,
      intensity: req.body.intensity,
    };

    // Add the new exercise to the workout's exercises array
    workout.exercises.push(newExercise);

    // Save the updated user data
    await currentUser.save();

    // Redirect to the workout details page
    res.redirect(`/users/${currentUser._id}/workouts/${workout._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding exercise");
  }
});


// DELETE /users/:userId/workouts/:workoutId
router.delete('/:workoutId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workoutToDelete = currentUser.workouts.id(req.params.workoutId);

    workoutToDelete.deleteOne();
    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/workouts`);
  } catch (error) {
    console.error(error);
    res.status(500).redirect('/');

  }
});
// TODO: need type checking for entryies
// POST /users/:userId/workouts
router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const newExercise = {
      muscleGroup: req.body.muscleGroup,
      exercise: req.body.exercise,
      weight: req.body.weight,
      sets: req.body.sets,
      repGoal: req.body.repGoal,
      actualReps: req.body.actualReps,
      intensity: req.body.intensity,
    }

    const newWorkout = {
      date: req.body.date,
      exercises: newExercise,
    }


    currentUser.workouts.push(newWorkout);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/workouts`)
  } catch (error) {
    printError(error);
    
  }
});

module.exports = router;