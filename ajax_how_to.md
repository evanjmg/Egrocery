FILES THAT CONNECT TO OR HAVE AJAX: 

PUBLIC -> JS: ajax.js
This is where I wrote all my ajax. I included the script in the top layouts.ejs file
VIEWS (in which ajax is applied): 
->SEARCH -> results.ejs - search results page - Ajax - Add cart / remove cart
-> PRODUCT -> index.ejs  - Ajax - Remove one from cart, Removeall from cart

CONTROLLERS -> product.js 
1 //  ADD PRODUCT TO CART - AJAX
router.post('/addtocart', authenticatedUser, function (req, res) ..
2 // DELETE ALL FROM CART -AJAX
router.delete('/deleteallfromcart', authenticatedUser...
3 //  REMOVE FROM CART - AJAX
router.delete('/removefromcart', authenticatedUser, function (...

Look at ajax.js for more.  


