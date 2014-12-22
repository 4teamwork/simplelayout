module.exports = function(grunt) {
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
    }
  });

  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('test', ['mocha']);
};