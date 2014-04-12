(function () {
  'use strict';

  var gulp = require('gulp');
  var jshint = require('gulp-jshint');
  var browserify = require('gulp-browserify');
  var clean = require('gulp-clean');
  var jsdoc = require('gulp-jsdoc');

  // Browser package
  gulp.task('clean-browser', function() {
    return gulp.src('./browser/browser.js', { read: false })
      .pipe(clean());
  });
  gulp.task('browser', ['clean-browser'], function() {
    return gulp.src('src/index.js')
      .pipe(browserify())
      .pipe(gulp.dest('./browser/browser.js'));
  });

  // API docs
  gulp.task('clean-apidoc', function() {
    return gulp.src('apidocs', { read: false })
      .pipe(clean());
  });
  gulp.task('apidoc', ['clean-apidoc'], function() {
    return gulp.src(['src/README.md', 'src/**/*.js'])
      .pipe(jsdoc('apidocs'));
  });

  // Linter
  gulp.task('lint', function() {
    return gulp.src(['gulpfile.js', 'src/**/*.js', 'test/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  });

  gulp.task('default', ['lint', 'browser', 'apidoc']);
})();
