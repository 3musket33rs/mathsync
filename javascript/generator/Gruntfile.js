module.exports = function(grunt) {
  'use strict';

  var _ = require('underscore');

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    jshint : {
      options : {
        curly : true,
        bitwise : false,
        camelcase : true,
        eqeqeq : true,
        forin : true,
        immed : true,
        latedef : true,
        newcap : true,
        noarg : true,
        noempty : true,
        typed : true,
        nonew : true,
        plusplus : false,
        indent : 2,
        undef : true,
        quotmark : 'single',
        unused : true,
        strict : true,
        trailing : true,
        esnext : true,
        globals : {
          require : false,
          module : true,
          describe : false,
          it : false
        }
      },
      all : [ 'Gruntfile.js', 'src/**/*.js', 'test/**/*.js' ]
    },
    regenerator: {
      dist: {
        files: {
          'es5/summarizer.js': 'src/summarizer.js'
        }
      }
    },
    browserify : {
      dist  : {
        files: {
          'browser/summarizer.js': 'es5/summarizer.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-regenerator');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'regenerator', 'browserify']);
};
