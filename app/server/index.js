var bodyParser = require('koa-bodyparser');
var compress = require('koa-compress');
var dotenv = require('dotenv');
var favicon = require('koa-favicon');
var koa = require('koa');
var locals = require('koa-locals');
var logger = require('koa-logger');
var path = require('path');
var router = require('koa-router');
var serve = require('koa-static');
var session = require('koa-session');

dotenv.load();

var app = koa();
var routes = require(path.resolve(__dirname, 'routes'));
var db = require(path.resolve(__dirname, '../..', 'db'));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}

app.keys = [process.env.SESSION_SECRET];

app.use(session());
app.use(favicon(path.resolve(__dirname, '../..', 'public/favicon.ico')));
app.use(bodyParser());
app.use(router(app));
app.use(serve(path.resolve(__dirname, '../..', 'public')));
app.use(serve(path.resolve(__dirname, '../..', 'node_modules/jquery/dist')));
app.use(serve(path.resolve(__dirname, '../..', 'node_modules/bootstrap/dist/js')));
app.use(serve(path.resolve(__dirname, '../..', 'node_modules/bootstrap/dist/css')));
app.use(compress());

locals(app, {
  assemblyRoot: 'https://assembly.com',
  title: 'Assembly Payments',
  publishableKey: process.env.STRIPE_PUBLISHABLE,
});

routes(app);

app.listen(process.env.PORT || 8000);

module.exports = app;
