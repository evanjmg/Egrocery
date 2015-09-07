var express = require('express'),
app = express(),
bodyParser = require('body-parser'), 
mongoose = require('mongoose'),
layouts = require('express-ejs-layouts'),
morgan = require('morgan'),
passport = require('passport'),
sassMiddleware = require('node-sass-middleware'),
path = require('path'),
connect = require('connect'), request = require('request'),
GoogleStrategy = require('passport-google-oauth').OAuthStrategy,
cookieParser = require('cookie-parser'),
session      = require('express-session'),
flash        = require('connect-flash'),
Product = require('./models/product'),
Order = require('./models/order'),
User = require('./models/user'),
MongoStore = require('connect-mongo')(session);

var databaseURL = process.env.MONGOLAB_URI ||'mongodb://localhost/e-commerce';
mongoose.connect(databaseURL);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended:false}));

var methodOverride = require('method-override');


app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it.
    delete req.body._method
    return method
  }
}));

var srcPath = './sass';
var destPath = './public/styles';

// app.use('/styles', sassMiddleware({
//   src: srcPath,
//   dest: destPath,
//   debug: true,
//   outputStyle: 'expanded'
// }));
var Results = {
  searchResult: null
};


app.use(layouts);

app.set('views', './views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

require('./config/passport')(passport);

app.use(session({
  secret:'secret',
  maxAge: new Date(Date.now() + 3600000),
  store: new MongoStore({mongooseConnection:mongoose.connection})
})) 

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.use(function(req,res, next) {
  global.current_user = req.user;
  next();
});

app.use(function(req,res,next) {
  Product.find(function (err, products){
    global.products = products
    next();
  });
});
// Custom flash middleware --  from Ethan Brown's book, 'Web Development with Node & Express'
// app.use(function(req, res, next){
//     // if there's a flash message in the session request, make it available in the response, then delete it 
//     res.locals.sessionFlash = req.session.sessionFlash;
//     // delete  req.session.sessionFlash;
//     next();
// });

app.use(require('./controllers'));



app.listen(process.env.PORT || 4000, function () {
  console.log('listening on port 4000 - E-commerce')
});

