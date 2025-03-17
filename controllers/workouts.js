const express = require('express');
const router = express.Router();

const User = require('../models/user.js');



// GET /users/:userId/workouts
router.get('/', (req, res) => {

  try {
    res.render('workouts/index.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});



module.exports = router;