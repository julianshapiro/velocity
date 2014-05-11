module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    license: 'Copyright 2014 Julian Shapiro. MIT License: http://en.wikipedia.org/wiki/MIT_License',
    concat: {
      options: {
        separator: '\n\n'
      },
      jqueryShim: {
        options: {
          banner: 
              '/***************\n'+ 
              '    Details\n'+ 
              '***************/\n'+ 
                  '\n'+ 
              '/*!\n'+ 
              '* Velocity.js: Accelerated JavaScript animation.\n'+ 
              '* @version <%= pkg.version %>\n'+ 
              '* @docs <%= pkg.homepage %>\n'+ 
              '* @license <%= licence %>\n'+ 
              '*/\n\n'
        },
        src: [
          'jquery-shim.js',
          'jquery.velocity.js',
        ],
        dest: 'velocity.js'
      }
    },
    uglify: {
      options: {
            banner:
                '/*!\n'+ 
                '* Velocity.js: Accelerated JavaScript animation.\n'+ 
                '* @version <%= pkg.version %>\n'+ 
                '* @docs <%= pkg.homepage %>\n'+ 
                '* @license <%= licence %>\n'+ 
                '*/\n'
        },
      jqueryShim: {
        src: 'velocity.js',
        dest: 'velocity.min.js'
      },
      jqueryPlugin: {
        src: 'jquery.velocity.js',
        dest: 'jquery.velocity.min.js'
      }
    },
    watch: {
      files: ['jquery.velocity.js'],
      tasks: ['concat', 'uglify']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);
};