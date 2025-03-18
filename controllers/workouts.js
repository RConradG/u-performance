const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// helper arrow function that prints the caught error
const printError = error => {
  console.log(error);
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
    console.error(error);
    res.redirect('/');
  }
});

// GET /user/:userId/workouts/:workoutId
router.put('/:workoutId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const workoutToUpdate = currentUser.workouts.id(req.params.workoutId);

    workoutToUpdate.set(req.body);
    await currentUser.save();

    res.redirect(`/`);
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
    res.render('workouts/index.ejs', {
      workouts: currentUser.workouts
    });
  } catch (error) {
    printError(error);
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
    currentUser.workouts.push(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/workouts`)
  } catch (error) {
    printError(error);
    
  }
});

// // display workouts in workouts template
// // GET /users/:userId/workouts
// router.get('/:workoutId', async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.session.user._id);
//     const workouts = currentUser.workouts;
//     const workout = workouts.findById(req.params.workout._id);

//     res.render('workouts/index.ejs', {
//       workout: workout,
//     });
//   } catch (error) {
//     printError(error);
//   }
// });




module.exports = router;