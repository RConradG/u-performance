const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

/* ----------------------------------- ROUTERS------------------------------------------ */
// 'starting' endpoint, already here: /users/:userId/workouts 

// GET /users/:userId/workouts/:workoutId/add-exercises
router.get('/:workoutId/add-exercise', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    if (!currentUser) return res.status(404).send("User not found");

    const workout = currentUser.workouts.id(req.params.workoutId);
    if (!workout) return res.status(404).send("Workout not found");

    // Render add-exercise.ejs and pass user and workout data
    res.render('workouts/add-exercise.ejs', { 
      user: currentUser,
      workout: workout,
     });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading add exercise page");
  }
});

router.get('/new', async (req, res) => {
  try {
    res.render('workouts/new.ejs');
  } catch (error) {
    
  };
});

// POST /users/:userId/workouts/:workoutId/date
router.put('/:workoutId/date', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workout = currentUser.workouts.id(req.params.workoutId);
    
    workout.date = req.body.date;

    await currentUser.save();

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});


// GET /users/:userId/workouts/:workoutId/exercises/:exerciseId
router.get('/:workoutId/exercises/:exerciseId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workout = currentUser.workouts.id(req.params.workoutId);
    const exercise = workout.exercises.id(req.params.exerciseId);
    res.render('workouts/edit-exercise.ejs', {
      user: currentUser,
      workout: workout,
      exercise: exercise,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error editing exercise');
  }
}); 

// POST /user/:userId/workouts/:workoutId/exercises/:exerciseId
router.put('/:workoutId/exercises/:exerciseId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workoutToUpdate = currentUser.workouts.id(req.params.workoutId);
    const updatedExercise = {
      muscleGroup: req.body.muscleGroup,
      exercise: req.body.exercise,
      weight: req.body.weight,
      sets: req.body.sets,
      repGoal: req.body.repGoal,
      actualReps: req.body.actualReps,
      intensity: req.body.intensity,
    }

    const exerciseToUpdate = workoutToUpdate.exercises.id(req.params.exerciseId);

    exerciseToUpdate.set(updatedExercise);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/workouts/${workoutToUpdate._id}`);

  } catch (error) {
    console.error(error);
    res.status(500).redirect('/');
  }
});

// DELETE /users/userId/workouts/:workoutId/exercises/:exerciseId
router.delete('/:workoutId/exercises/:exerciseId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workout = currentUser.workouts.id(req.params.workoutId);
    const exerciseToDelete = workout.exercises.id(req.params.exerciseId);
    exerciseToDelete.deleteOne();
    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/workouts/${workout._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).redirect('/');
  }
});


// POST /users/:userId/workouts/:workoutId/add-exercise <- adds exercise
router.post('/:workoutId/exercises', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workout = currentUser.workouts.id(req.params.workoutId);
    const newExercise = {
      muscleGroup: req.body.muscleGroup,
      exercise: req.body.exercise,
      weight: req.body.weight,
      sets: req.body.sets,
      repGoal: req.body.repGoal,
      actualReps: req.body.actualReps,
      intensity: req.body.intensity,
    };

    workout.exercises.push(newExercise);

    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/workouts/${workout._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding exercise");
  }
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

// PUT /user/:userId/workouts/:workoutId
router.put('/:workoutId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workoutToUpdate = currentUser.workouts.id(req.params.workoutId);
    const updatedExercise = {
      muscleGroup: req.body.muscleGroup,
      exercise: req.body.exercise,
      weight: req.body.weight,
      sets: req.body.sets,
      repGoal: req.body.repGoal,
      actualReps: req.body.actualReps,
      intensity: req.body.intensity,
    }
    const updatedWorkout = {
      date: req.body.date,
      exercises: updatedExercise, 
    }

    workoutToUpdate.set(updatedWorkout);
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
    console.error(error);
    res.redirect('/');
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
    
    const newWorkout = {
      date: req.body.date,
      exercises: [],
    };

    currentUser.workouts.push(newWorkout);

    await currentUser.save();

    const workoutId = currentUser.workouts[currentUser.workouts.length - 1]._id;

    res.redirect(`/users/${currentUser._id}/workouts/${workoutId}/add-exercise`);
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;