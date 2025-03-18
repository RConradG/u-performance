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

// GET /users/:userId/workouts/show
router.get('/show', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    if (!currentUser) {
      return res.status(404).send('User not found');
    }
    res.send("this is the where the workouts will be shown");
    // res.render('workouts/show.ejs');
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

router.get('/new', async (req, res) => {
  try {
    res.render('workouts/new.ejs');
  } catch (error) {
    c
  }
})

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

// display workouts in workouts template
// GET /users/:userId/workouts
router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('workouts/index.ejs', {
      workouts: currentUser.workouts,
    });
  } catch (error) {
    printError(error);
  }
});



module.exports = router;