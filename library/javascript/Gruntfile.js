module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    jshint : {
      all : [ 'Gruntfile.js', 'src/**/*.js', 'test/**/*.js' ]
    },
    browserify : {
      dist  : {
        files: {
          'build/browser.js': 'src/**/*.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'browserify']);
};
