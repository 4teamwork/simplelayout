module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    config: {
      dev: {
        options: {
          variables: {
            'optimize': 'none',
            'sass-style' : 'expanded',
            'sourcemap' : 'inline',
            'cssoutput' : 'dist/simplelayout.css',
            'jsoutput' : 'dist/simplelayout.js'
          }
        }
      },
      prod: {
        options: {
          variables: {
            'optimize': 'uglify',
            'sass-style' : 'compressed',
            'sourcemap' : 'none',
            'cssoutput' : 'dist/simplelayout.min.css',
            'jsoutput' : 'dist/simplelayout.min.js'
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
          include: ['simplelayout/Simplelayout', 'toolbox/Toolbox'],
          out: '<%= grunt.config.get("jsoutput") %>',
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
          style: '<%= grunt.config.get("sass-style") %>',
          sourcemap: '<%= grunt.config.get("sourcemap") %>',
        },
        files: {
          '<%= grunt.config.get("cssoutput") %>' : 'styles/scss/main.scss',
        }
      }
    },
    watch: {
      scripts: {
        files: ['scripts/**/*.js', 'styles/scss/*.scss'],
        tasks: ['requirejs', 'sass'],
        options: {
          spawn: false,
        },
      },
    },
    clean : ['dist']
  });

  grunt.loadNpmTasks('grunt-config');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('dev', ['clean', 'config:dev', 'requirejs', 'sass', 'watch']);
  grunt.registerTask('prod', ['clean','config:prod', 'requirejs', 'sass']);
  grunt.registerTask('default', ['dev']);

};
