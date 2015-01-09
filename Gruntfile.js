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
          almond : true,
          baseUrl: 'scripts',
          mainConfigFile: 'scripts/config.js',
          findNestedDependencies: true,
          name: '../node_modules/almond/almond',
          include : ['simplelayout/Simplelayout', 'toolbox/Toolbox'],
          out: 'dist/simplelayout.js',
          optimize : 'none',
          wrap: {
            startFile: "build/start.frag",
            endFile: "build/end.frag"
          },
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('build', ['requirejs']);
};
