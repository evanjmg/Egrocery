var AddToCart = AddToCart || {};
$(function (){
  AddToCart.initialize();
  DeleteAllinCart.initialize();
})

AddToCart.fields = ["price", "name", "image"];

var DeleteAllinCart = DeleteAllinCart || {};

DeleteAllinCart.initialize = function () {

$('#deletecart').on('click', function (){
  event.preventDefault();
  $.ajax({
    type: "DELETE",
    url: "/products/deleteallfromcart"
  });
  $(this).addClass('animated bounceOut');
  $('.products').addClass('animated bounceOut');
  $('.total').html('Total: £0');
  $('.cart-total').html('0')

})
}



AddToCart.initialize = function () {
  $('.form-cart').on('submit', function () {
    event.preventDefault();
    var form = $(this);

    if (form.children('.addtocart').val() == 'Add To Cart') {
      // Add to Cart
    var data = {}
    $.each(AddToCart.fields, function(i, field){
      data[field] = form.children('.' + field).val();
    });
    $.ajax({
      type: "POST",
      url: form.attr('action'),
      data:  data,
      dataType: "json"
    });
    $('h4.message').html("Added "+ data['name']+" to cart!");
    var currentTotal = parseInt($('.cart-total').html());
    $('.cart-total').html(String(currentTotal + 1));
    form.children('input.addtocart').val('In Cart');
  } else {
    // Remove from cartaå
    var product_name = form.children('.name').val();
    $.ajax({
      type: "DELETE",
      url: '/products/removefromcart',
      data: {name: product_name },
      dataType: "json"
    });
    var currentTotal = parseInt($('.cart-total').html());
    $('h4.message').html("Removed "+ product_name +" from cart!");
    $('.cart-total').html(String(currentTotal - 1));
    if (form.hasClass('in-cart')) {
      var previous_value = parseFloat($('#total-value').html());
      
      $('#total-value').html(String((previous_value - parseFloat(form.children('.price').val())).toFixed(2)));

      form.parent('.products').addClass('animated bounceOut');
    }
    else {
    form.children('input.addtocart').val('Add To Cart'); 
  }

  }

})
}

