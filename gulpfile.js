var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var nib = require('nib');
var nodemon = require('gulp-nodemon');
var path = require('path');
var source = require('vinyl-source-stream');

var ERROR_LEVELS = ['error', 'warning'];

var isFatal = function(level) {
  return ERROR_LEVELS.indexOf(level) === -1;
};

var handleError = function(level, error) {
  gutil.log(error.message);

  if (isFatal(level)) {
    process.exit(1);
  }
};

var onError = function(error) {
  handleError.call(this, 'error', error);
};

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
      .pipe(gulp.dest('./public/js'))
      .on('error', onError);
  };

  if (global.isWatching) {
    bundler.on('update', bundle);
  }

  return bundle();
});

gulp.task('less', function() {
  gulp.src('./public/less/style.less')
    .pipe(less({
      paths: [ path.resolve(__dirname, 'node_modules/bootstrap/less') ]
    }))
    .pipe(gulp.dest('./public/css'))
    .on('error', onError);
});

gulp.task('watch', function() {
  global.isWatching = true;

  gulp.watch('./public/less/**/*.less', ['less']);
  gulp.watch('./app/client/**', ['browserify']);
});

gulp.task('demon', function() {
  nodemon({
    script: 'index.js',
    nodeArgs: ['--harmony'],
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    },
    ignore: [
      'node_modules/**',
      'test/**',
      'app/client/**',
      'public/**'
    ]
  })
  .on('error', onError);
});

gulp.task('build', ['browserify', 'less']);
gulp.task('default', ['build', 'watch', 'demon']);
