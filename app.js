var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    layouts = require('express-ejs-layouts'),
    morgan = require('morgan'),
    sassMiddleware = require('node-sass-middleware'),
    path = require('path'),
    serveStatic = require('serve-static'),
    connect = require('connect'), request = require('request'),cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    flash        = require('connect-flash'),
    Product = require('./models/product'),
    Order = require('./models/order'),
    User = require('./models/user');

    var sessionStore = new session.MemoryStore;
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended:false}));

var methodOverride = require('method-override');

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
app.use(cookieParser('secret'));
// app.use(session({cookie: { maxAge: 60000 }}));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});





app.use(morgan('dev'));


app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
app.use(layouts);
app.use(express.static(__dirname + '/public'));
app.set('views', './views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');



var mongoose = require('mongoose');
var databaseURL = process.env.MONGOLAB_URI ||'mongodb://localhost/e-commerce';
mongoose.connect(databaseURL);
app.use(require('./controllers'));


app.listen(process.env.PORT || 4000, function () {
  console.log('listening on port 4000 - E-commerce')
});

