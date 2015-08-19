var passport = require("passport");

var express = require('express'), 
router = express.Router();
var User = require('../models/user');
authenticatedUser = function (req,res,next) {
      if (req.isAuthenticated()) return next();
      res.redirect('/users/login');
    }
// ALL USERS
router.get('/', authenticatedUser, function (req, res) {
  User.find(function(err, users) {
    if (err) console.log(err);
    res.render('./users/index', { users: users} )
  })
 
});
// EDIT USER
router.get('/:id/edit', authenticatedUser, function(req, res){
  User.findById(req.params.id, function (err, user) {
    res.render('./users/edit', { user: user})
  });
})

// GET - NEW USER - SIGN UP 
router.get('/signup', function (req, res){
  res.render('./users/new', { message: req.flash('signupMessage')})
});

// POST - NEW USER - SIGN UP
router.post('/', function (req, res) {
 var signupStrategy = passport.authenticate('local-signup', {
   // invokes req.login method -we don't write it because we have a separate strategy
   successRedirect : '/',
   failureRedirect : '/signup',
   failureFlash    : true
 });
 return signupStrategy(req,res);
});
// GET - LOGIN USER - LOCAL
router.get('/login', function (req, res){
  res.render('./users/login', { message: req.flash('loginMessage')});
});
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// POST /login 
router.post('/login', function (req, res){
  var loginStrategy = passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/users/login',
    failureFlash    : true
  });
  return loginStrategy(req, res);
})
// LOGOUT USER
router.get('/logout', function (req,res){
  req.logout();
  res.redirect('/');
});
//  GET - USER SHOW
router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) console.log(err);
    res.render('./users/show', { user: user })
  })
});


router.post('/:id', authenticatedUser, function (req,res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
    res.redirect('/users/'+ user.id);
  })
}); 
// USER DELETE
router.delete('/:id', authenticatedUser, function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) console.log(err);
    user.remove();
    res.redirect('/');
  });
});

module.exports = router;