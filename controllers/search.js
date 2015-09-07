var express = require('express'), 
router = express.Router();
var Order = require('../models/order');
var Product = require('../models/product');
var User = require('../models/user');
var request = require('request');


var TescoProductSearch = function (query, callback) {

  request('https://secure.techfortesco.com/tescolabsapi/restservice.aspx?command=LOGIN&email=&developerkey='+ process.env.TESCO_API_ACCOUNT_KEY+ '&applicationkey='+ process.env.TESCO_API_APP_KEY, function (err, resp, b) {
    console.log(resp)
    request('https://secure.techfortesco.com/tescolabsapi/restservice.aspx?command=PRODUCTSEARCH&searchtext='+ query +'&page=1&sessionkey='+(JSON.parse(b)).SessionKey, function (error, response, body) {
      if (error) console.log(error);
      if (!error && response.statusCode == 200) {

       callback(body); }
     });
  })
}
router.get('/', function(req,res) {
  Order.find(function (err, orders) {
    Product.find(function (err, products) {
      res.render('./search/home', { products: products, orders: orders })
    });
  }); 
});
// results
router.get('/:query', function (req,res) {
  TescoProductSearch(req.params.query, function (response) {
    console.log(response);
    var TescoResponse = JSON.parse(response);
      res.render('./search/results', { tescoproducts: TescoResponse.Products, message: res.locals.sessionFlash }) });
});

// search bar
router.post('/', function (req, res) {
  res.redirect('/search/'+req.body.query)
})
module.exports = router;
