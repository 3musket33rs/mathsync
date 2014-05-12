(function () {
  'use strict';

  var gulp = require('gulp');
  var jshint = require('gulp-jshint');
  var clean = require('gulp-clean');
  var jsdoc = require('gulp-jsdoc');
  var mocha = require('gulp-mocha');
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');

  // Browser package
  gulp.task('clean-browser', function() {
    return gulp.src('browser', { read: false })
      .pipe(clean());
  });
  gulp.task('browser', ['clean-browser'], function() {
    return browserify('./src/index.js')
      .bundle()
      .pipe(source('browser.js'))
      .pipe(gulp.dest('browser'));
  });

  // Tests
  gulp.task('test', function () {
    return gulp.src('test/**/*.js')
      .pipe(mocha({reporter: 'spec'}));
  });

  // API docs
  gulp.task('clean-apidoc', function() {
    return gulp.src('apidocs', { read: false })
      .pipe(clean());
  });
  gulp.task('apidoc', ['clean-apidoc'], function() {
    return gulp.src('src/**/*.js')
      .pipe(jsdoc('apidocs'));
  });

  // Linter
  gulp.task('lint', function() {
    return gulp.src(['gulpfile.js', 'src/**/*.js', 'test/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  });

  gulp.task('default', ['lint', 'browser', 'apidoc', 'test']);
})();
