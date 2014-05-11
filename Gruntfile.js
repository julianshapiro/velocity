module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    licence: 'Copyright 2014 Julian Shapiro. MIT License: http://en.wikipedia.org/wiki/MIT_License',
    concat: {
      options: {
        separator: '\n\n'
      },
      dependencyLess: {
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
          'src/init.js',
          'src/utilities.js',
          'src/instance.js'
        ],
        dest: 'velocity.js'
      },
      jqueryPlugin: {
        options: {
          banner:
              '/***************\n'+ 
              '    Details\n'+ 
              '***************/\n'+ 
              '\n'+ 
              '/*!\n'+ 
              '* Velocity.js: Accelerated JavaScript animation.\n'+ 
              '* @version <%= pkg.version %>\n'+ 
              '* @requires jQuery.js\n'+ 
              '* @docs <%= pkg.homepage %>\n'+ 
              '* @license <%= licence %>\n'+ 
              '*/\n\n'
        },
        src: [
          'src/init.js',
          'src/instance.js'
        ],
        dest: 'jquery.velocity.js'
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
      dependencyLess: {
        src: 'velocity.js',
        dest: 'velocity.min.js'
      },
      jqueryPlugin: {
        src: 'jquery.velocity.js',
        dest: 'jquery.velocity.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);
};

/*

          'src/sequences.prefix.js',
          'sequences/*.js',
          'sequences/* /*.js',
          'src/sequences.suffix.js'*/