module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    config: {
      dev: {
        options: {
          variables: {
            'optimize': 'none',
            'sass-style' : 'expanded'
          }
        }
      },
      prod: {
        options: {
          variables: {
            'optimize': 'uglify',
            'sass-style' : 'compressed'
          }
        }
      }
    },


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
          optimize : '<%= grunt.config.get("optimize") %>',
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
          style: '<%= grunt.config.get("sass-style") %>'
        },
        files: {
          'dist/main.css': 'styles/scss/main.scss'
        }
      }
    },
    watch: {
      scripts: {
        files: ['scripts/**/*.js', 'styles/scss/*.scss'],
        tasks: ['config:dev', 'requirejs', 'sass'],
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
  grunt.loadNpmTasks('grunt-config');

  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('dev', ['config:dev', 'requirejs', 'sass', 'watch']);
  grunt.registerTask('prod', ['config:prod', 'requirejs', 'sass']);
  grunt.registerTask('default', ['dev']);

};
