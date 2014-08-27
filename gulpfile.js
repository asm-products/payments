var browserify = require('browserify');
var gulp = require('gulp');
var less = require('gulp-less');
var nib = require('nib');
var nodemon = require('gulp-nodemon');
var path = require('path');
var source = require('vinyl-source-stream');

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

gulp.task('less', function() {
  gulp.src('./public/less/style.less')
    .pipe(less({
      paths: [ path.resolve(__dirname, 'node_modules/bootstrap/less') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
  global.isWatching = true;

  gulp.watch('./app/client/style.styl', ['stylus']);
  gulp.watch('./app/client/**/*.jsx', ['browserify']);
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
      './node_modules/**',
      './test/**',
      './app/client/**'
    ]
  });
});

gulp.task('build', ['browserify', 'less']);
gulp.task('default', ['build', 'watch', 'demon']);
