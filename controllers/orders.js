var express = require('express'), 
router = express.Router();
stripe = require("stripe")(
  process.env.STRIPE_API_TEST_SECRET_KEY
  );
authenticatedUser = function (req,res,next) {
      if (req.isAuthenticated()) return next();
      res.redirect('/users/login');
    }

var Order = require('../models/order');
var Product = require('../models/product');
var User = require('../models/user');
// GET - ALL ORDERS
router.get('/',authenticatedUser, function (req, res) {
    Order.find(function (err, orders) {
      res.render('./orders/index', { orders: orders})
  });
})
// GET PAYMENT PAGE
router.get('/payment', authenticatedUser,function (req,res) {
       var i=0,j=0,total=0;
       for(i;i < current_user.products.length;i++) {
         total += parseFloat(current_user.products[i].price);
       }
      res.render('./orders/payment', { total: total, message:  req.flash('payment-error') });
   // });

})
// POST - CREATE ORDER - WHEN SUBMIT PAGEMENT
router.post('', authenticatedUser, function (req, res) {

  Order.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, order) {
    if(err) console.log(err)
      var total = 0;
      if (order.total.indexOf('.') !== -1) {
            total = parseInt(order.total.replace('.',''))
           }
            else {
            total = parseInt(order.total)*100

          }

      var stripeToken = req.body.stripeToken;
    console.log(stripeToken)
    var charge = stripe.charges.create({
      amount: total , // amount in cents, again
      currency: "gbp",
      source: stripeToken,
      description: 'Purchased '+ order.products.length
    }, function(err, charge) {
      if (err != null)
      switch (err.type) {
        case 'StripeCardError':
          // A declined card error
          console.log('card declined');
       req.flash( 'payment-error', err.message)
          res.redirect('/orders/payment');
          err.message; // => e.g. "Your card's expiration year is invalid."
          break;
          case 'StripeInvalidRequest':
         req.flash( 'payment-error', err.message)
          res.redirect('/orders/payment');// Invalid parameters were supplied to Stripe's API
          break;
          case 'StripeAPIError':
         req.flash( 'payment-error', err.message)
          res.redirect('/orders/payment');// An error occurred internally with Stripe's API
          break;
          case 'StripeConnectionError':
          req.flash( 'payment-error', err.message)
                  res.redirect('/orders/payment');// Some kind of error occurred during the HTTPS communication
          break;
          case 'StripeAuthenticationError':
         console.log(err); // You probably used an incorrect API key
        } 
        else {

          var i=0,j=0,total=0;
          for(i;i < current_user.products.length;i++) {
            total += parseFloat(current_user.products[i].price);
          }
          console.log(products);
          o = new Order({ total: total.toFixed(2)});
          for(j;j < current_user.products.length;j++) {
            o.products.push(current_user.products[j]) }
            console.log(o);
            o.save(function(err){ 
              if(err) console.log(err);
              console.log('sucessfully saved');
            });
        console.log('success');
        User.findById(current_user.id, function (err, user){
          user.products.splice(0, user.products.length);
         user.save();
        });
       
        res.redirect('/orders/confirmation');
        }
      });
}); 
});
 
// GET CONFIRMATION
router.get('/confirmation', authenticatedUser, function (req, res) {
  current_user.products = [];
  current_user.save(function(){})
    res.render('./orders/confirmation');
})

module.exports = router;