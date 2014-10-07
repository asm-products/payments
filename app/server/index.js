var compress = require('koa-compress');
var dotenv = require('dotenv');
var favicon = require('koa-favicon');
var jsonBody = require('koa-parse-json');
var koa = require('koa');
var locals = require('koa-locals');
var logger = require('koa-logger');
var path = require('path');
var router = require('koa-router');
var serve = require('koa-static');
var session = require('koa-session');

if (process.env.NODE_ENV !== 'production') {
  // process.env.MONGOHQ_URL = 'mongodb://localhost/payments-' + process.env.NODE_ENV;
}

dotenv.load();

var app = koa();
var routes = require(path.resolve(__dirname, 'routes'));
var db = require(path.resolve(__dirname, '../..', 'db'));
var stripeKey = require(path.resolve(__dirname, 'middleware/stripe_key'));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}

app.keys = [process.env.SESSION_SECRET];

app.use(session());
app.use(favicon(path.resolve(__dirname, '../..', 'public/favicon.ico')));
app.use(jsonBody());
app.use(router(app));
app.use(serve(path.resolve(__dirname, '../..', 'public')));
app.use(serve(path.resolve(__dirname, '../..', 'node_modules/jquery/dist')));
app.use(serve(path.resolve(__dirname, '../..', 'node_modules/bootstrap/dist/js')));
app.use(serve(path.resolve(__dirname, '../..', 'node_modules/bootstrap/dist/css')));
app.use(compress());
app.use(stripeKey);

locals(app, {
  assemblyRoot: 'https://assembly.com',
  title: 'Assembly Payments',
  publishableKey: process.env.STRIPE_PUBLISHABLE,
});

routes(app);

app.listen(process.env.PORT || 8000);

module.exports = app;
