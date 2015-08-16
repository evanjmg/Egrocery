var express = require('express'), 
router = express.Router();
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
router.use('/search', require('./search'));

router.get('/', function (req,res) {
  res.redirect('/search')
});

module.exports = router;