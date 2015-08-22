// Define objects
var ChangeCart = ChangeCart || {};
var DeleteAllinCart = DeleteAllinCart || {};
// Initialize the objects and their functions
$(function (){
  DeleteAllinCart.initialize();
  ChangeCart.initialize();
});

// DELETE ALL IN THE CART
DeleteAllinCart.initialize = function () {
// on clicking the clear cart button (a tag) ....
$('#deletecart').on('click', function (){
  // prevent link from making a get request and refreshing the page
  event.preventDefault();
  // instead of default link get request, we decide to do our own ajax request
  $.ajax({
    type: "DELETE",
    url: "/products/deleteallfromcart"
  });
  // hide clear cart button (this) with a cool animate.css animation
  $(this).addClass('animated bounceOut');
  // hide all the products with same animation
  $('.products').addClass('animated bounceOut');
  // make the total zero
  $('.total').html('Total: £0');
  // change the cart total
  $('.cart-total').html('0')

})
}

// Add or Remove Product from cart depending on the text value of button (like Remove or Add)
ChangeCart.fields = ["price", "name", "image"];
ChangeCart.initialize = function () {
  // On clicking submit for the hidden product form (with only one button)

  $('.form-cart').on('submit', function () {
    // note in results.ejs - everything is hidden except the input button and it has a value of Add to Cart 
    
    // prevent submitting the form and it's post action  
    event.preventDefault();
    // save this to a form variable
    var form = $(this);


    // Add to Cart
    // if the form's visible input [type='submit'] tag is equal to 'Add to Cart' do the following
    if (form.children('.addtocart').val() == 'Add To Cart') {
    // make a temporary data object to store the form's current input values
    var data = {}
    // Go through each of the hidden inputs and use the fields array above ChangeCart.initialize
    $.each(ChangeCart.fields, function(i, field){
      // get the value of each input and assign it to a key in the data table
      data[field] = form.children('.' + field).val();
    });
    // Make an ajax post request to send the data created above to the POST /addtocart in the controller
    $.ajax({
      type: "POST",
      // take the url of the action.
      url: form.attr('action'),
      data:  data,
      dataType: "json"
    });
    // look in the controller at POST /addtocart for more then come back

    // change the text on the page because we have not refereshed

    // add text to the message header 
    $('h4.message').html("Added "+ data['name']+" to cart!");
    // get the current value of the cart in the html
    var currentTotal = parseInt($('.cart-total').html());
    // add one to the cart total 
    $('.cart-total').html(String(currentTotal + 1));

    //  change the value of the only visible input button
    form.children('input.addtocart').val('In Cart');
  } else {

    // REMOVE FROM CART - 2 use cases - one in results.ejs, another in product/index.ejs
    // CASE 1 - results.ejs -  After clicking Add to Cart, you can click the In Cart button to remove it from the cart.
    //  CASE 2 - index.ejs - remove item from cart



    // Get the product name to identify the product.
    var product_name = form.children('.name').val();
    //  send a delete request with data the product name - see products controller
    $.ajax({
      type: "DELETE",
      url: '/products/removefromcart',
      data: {name: product_name },
      dataType: "json"
    });

    // get current Total 
    var currentTotal = parseInt($('.cart-total').html());
    // minus one from current total
    $('.cart-total').html(String(currentTotal - 1));
    // add a message saying Removed product from cart
    $('h4.message').html("Removed "+ product_name +" from cart!");

    // CASE 1 - product/index.ejs
    // if the  form has the class in-cart do this...
    if (form.hasClass('in-cart')) {
      //  get the current total - sum of the prices of products in the cart
      var currentTotal = parseFloat($('#total-value').html());
      
      // subtract the price of the removed product from the total
      $('#total-value').html(String((currentTotal - parseFloat(form.children('.price').val())).toFixed(2)));

      // remove the product with a cool bounce animation
      form.parent('.products').addClass('animated bounceOut');
    }
    else {
      // CASE 2 - results.ejs
      // change the value of the visible input to 'Add to Cart'
    form.children('input.addtocart').val('Add To Cart'); 
  }

  }

})
}

