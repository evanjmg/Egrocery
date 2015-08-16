var express = require('express'), 
router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res) {
  User.find(function(err, users) {
    if (err) console.log(err);
    res.render('./users/index', { users: users} )
  })
 
});
router.get('/:id/edit', function(req, res){
  User.findById(req.params.id, function (err, user) {
    res.render('./users/edit', { user: user})
  });
})
router.get('/new', function (req, res){
  res.render('./users/new');
})
router.post('/', function (req, res) {
  User.create(req.body, function (err, user){
    if (err) console.log(err);
    res.redirect('/users/' + user.id);
  });
});
router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) console.log(err);
    res.render('./users/show', { user: user })
  })
});
router.post('/:id', function (req,res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
    res.redirect('/users/'+ user.id);
  })
})
router.delete('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) console.log(err);
    user.remove();
    res.redirect('/users');
  });
});
module.exports = router;