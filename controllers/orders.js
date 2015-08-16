var express = require('express'), 
router = express.Router();
stripe = require("stripe")(
  process.env.STRIPE_API_TEST_SECRET_KEY
  );


var Order = require('../models/order');
var Product = require('../models/product');
var User = require('../models/user');

router.get('/', function (req, res) {
  Product.find(function (err, products) {
    Order.find(function (err, orders) {
      res.render('./orders/index', { orders: orders, products: products})
    })
  });
})

router.get('/payment',function (req,res) {
  Product.find(function (err,products) {
    var i=0,j=0,total=0;
    for(i;i < products.length;i++) {
      total += parseFloat(products[i].price);
    }
    console.log(products);
    o = new Order({ total: total.toFixed(2)});
    for(j;j < products.length;j++) {
      o.products.push(products[j]) }
      console.log(o);
      o.save(function(err){ 
        if(err) console.log(err);
        console.log('sucessfully saved');
      })

      res.render('./orders/payment', { products: products, total: total, message:  res.locals.sessionFlash });


   // });
});
})
router.post('', function (req, res) {

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
          req.session.sessionFlash = {
            type: 'declined',
            message: err.message
          }
          res.redirect('/orders/payment');
          err.message; // => e.g. "Your card's expiration year is invalid."
          break;
          case 'StripeInvalidRequest':
          req.session.sessionFlash = {
            type: 'declined',
            message: err.message
          }
          res.redirect('/orders/payment');// Invalid parameters were supplied to Stripe's API
          break;
          case 'StripeAPIError':
           req.session.sessionFlash = {
                     type: 'declined',
                     message: err.message
                   }
          res.redirect('/orders/payment');// An error occurred internally with Stripe's API
          break;
          case 'StripeConnectionError':
          req.session.sessionFlash = {
                    type: 'declined',
                    message: err.message
                  }
                  res.redirect('/orders/payment');// Some kind of error occurred during the HTTPS communication
          break;
          case 'StripeAuthenticationError':
         console.log(err); // You probably used an incorrect API key
        } 
        else {
        console.log(charge);
        console.log('*********************');
        console.log('success');
        res.redirect('/orders/confirmation');
        }
      });

}); 
});
      // saveStripeCustomerId(user, charge.customer);});
    // var customerId = getStripeCustomerId(user);

    // stripe.charges.create({
    //   amount: 1500, // amount in cents, again
    //   currency: "gbp",
    //   customer: customerId
    // },function(err, charge) {
    //     console.log(charge)
    //     if (err && err.type === 'StripeCardError') {
    //       // The card has been declined
    //       console.log('card declined')
    //     }
    //     });


router.get('/confirmation', function (req, res) {
  Product.remove({}, function (err) {
    if(err) console.log(err);
    console.log('cleared cart');
  });
  Product.find(function (err, products) {
    res.render('./orders/confirmation', { products: products});
  })

})

module.exports = router;