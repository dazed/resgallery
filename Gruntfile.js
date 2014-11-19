module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    jshint: {
      all: ['resgallery.js'],

      options: {
        curly: true,
        es5: true,
        eqnull: true,
        eqeqeq: true,
        undef: true,
        browser: true,
        globals: {
          jQuery: true,
          _: true,
          console: true,
          define: true
        }
      }

    },

    sass: {
      options: {
        style: 'expanded'
      },
      files: {
        'resgallery.css' : 'resgallery.scss'
      }
    },

    watch: {
      css: {
        files: '*.scss',
        tasks: ['sass']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default',['watch']);

};