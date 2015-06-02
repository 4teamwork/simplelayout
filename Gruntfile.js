module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({

    config: {
      dev: {
        options: {
          variables: {
            "optimize": "none",
            "sass-style": "expanded",
            "sourcemap": "inline",
            "cssoutput": "dist/simplelayout.css",
            "jsoutput": "dist/simplelayout.js"
          }
        }
      },
      prod: {
        options: {
          variables: {
            "optimize": "uglify",
            "sass-style": "compressed",
            "sourcemap": "none",
            "cssoutput": "dist/simplelayout.min.css",
            "jsoutput": "dist/simplelayout.min.js"
          }
        }
      }
    },


    mocha: {
      test: {
        src: ["test/test.html"],
        options: {
          log: true,
          reporter: "Spec",
          run: true
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          almond: true,
          baseUrl: "scripts",
          mainConfigFile: "scripts/config.js",
          findNestedDependencies: true,
          name: "../node_modules/almond/almond",
          include: ["simplelayout/Simplelayout", "toolbox/Toolbox", "matchHeight", "jsrender"],
          out: "<%= grunt.config.get('jsoutput') %>",
          optimize: "<%= grunt.config.get('optimize') %>",
          wrapShim: true,
          wrap: {
            startFile: "build/start.frag",
            endFile: "build/end.frag"
          }
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: "<%= grunt.config.get('sass-style') %>",
          sourcemap: "<%= grunt.config.get('sourcemap') %>"
        },
        files: {
          "<%= grunt.config.get('cssoutput') %>": "styles/scss/main.scss"
        }
      }
    },
    watch: {
      scripts: {
        files: ["scripts/**/*.js", "styles/scss/*.scss"],
        tasks: ["requirejs", "sass"],
        options: {
          spawn: false
        }
      }
    },
    clean: ["dist"],
    eslint: {
        target: ["Gruntfile.js", "test/**/*.js", "scripts/**/*.js"]
    },
    shell: {
        test: {
            command: "open http://localhost:8000/test/test.html ; python -m SimpleHTTPServer"
        }
    }
  });

  grunt.loadNpmTasks("grunt-config");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-mocha");
  grunt.loadNpmTasks("grunt-shell");

  grunt.registerTask("btest", ["shell:test"]);
  grunt.registerTask("lint", ["eslint"]);
  grunt.registerTask("test", ["mocha"]);
  grunt.registerTask("dev", ["clean", "config:dev", "lint", "requirejs", "sass", "watch"]);
  grunt.registerTask("prod", ["clean", "config:prod", "lint", "test", "requirejs", "sass"]);
  grunt.registerTask("default", ["dev"]);

};
