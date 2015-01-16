module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    mocha: {
      test: {
        // Test all files ending in .html anywhere inside the test directory.
        src: ['test/**/*.html'],
        options: {
          log: true,
          reporter: 'Spec',
          run: true
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          almond: true,
          baseUrl: 'scripts',
          mainConfigFile: 'scripts/config.js',
          findNestedDependencies: true,
          name: '../node_modules/almond/almond',
          include: ['simplelayout/Simplelayout', 'toolbox/Toolbox', 'overlay/Overlay'],
          out: 'dist/simplelayout.js',
          wrap: {
            startFile: "build/start.frag",
            endFile: "build/end.frag"
          },
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/main.css': 'styles/scss/main.scss'
        }
      }
    },
    watch: {
      scripts: {
        files: ['scripts/**/*.js', 'styles/scss/*.scss'],
        tasks: ['build'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('build', ['requirejs', 'sass']);
  grunt.registerTask('lueg', ['watch']);
};
