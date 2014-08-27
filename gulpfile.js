var browserify = require('browserify');
var gulp = require('gulp');
var nib = require('nib');
var path = require('path');
var source = require('vinyl-source-stream');
var stylus = require('gulp-stylus');

var server = require('./app/server');

var app;

gulp.task('browserify', function() {
  // The React(ify) magic happens in the package.json

  var bundler = browserify({
    entries: ['./app/client/app.js'],
    extensions: ['.js', '.jsx'],
    debug: true
  });

  var bundle = function() {
    bundler
      .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('./public/js'));
  };

  if (global.isWatching) {
    bundler.on('update', bundle);
  }

  return bundle();
});

gulp.task('stylus', function() {
  gulp.src('./public/styl/**/*.styl')
    .pipe(stylus({ use: [nib()] }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('serve', function() {
  app = server.listen(process.env.PORT || 8080);
});

gulp.task('close', function() {
  app.close();
});

gulp.task('watch', function() {
  global.isWatching = true;

  gulp.watch('./app/client/style.styl', ['stylus']);
  gulp.watch('./app/server/**/*.js', ['close', 'serve']);
  gulp.watch('./app/client/**/*.jsx', ['browserify']);
});

gulp.task('build', ['browserify', 'stylus']);
gulp.task('default', ['watch', 'build', 'serve']);
