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
          name: "almond/almond",
          baseUrl: "web/js/lib",
          optimize: "<%= grunt.config.get('optimize') %>",
          mainConfigFile: "web/js/app.js",
          include: ["app", "jsrender"],
          out: "<%= grunt.config.get('jsoutput') %>"
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
          "<%= grunt.config.get('cssoutput') %>": "web/styles/scss/main.scss"
        }
      }
    },
    watch: {
      scripts: {
        files: ["scripts/**/*.js", "web/styles/scss/*.scss"],
        tasks: ["sass"],
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
      serve: {
        command: "open http://localhost:8000/web/app.html"
      },
      test: {
        command: "open http://localhost:8282/test/test.html"
      }
    },
    "http-server": {
      serve: {
        port: 8000,
        host: "localhost"
      },
      test: {
        port: 8282,
        host: "localhost"
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
  grunt.loadNpmTasks("grunt-http-server");

  grunt.registerTask("browser-test", ["shell:test", "http-server:test"]);
  grunt.registerTask("serve", ["clean", "config:dev", "requirejs", "sass", "shell:serve", "http-server:serve"]);
  grunt.registerTask("lint", ["eslint"]);
  grunt.registerTask("test", ["mocha"]);
  grunt.registerTask("dev", ["clean", "config:dev", "lint", "requirejs", "sass", "watch"]);
  grunt.registerTask("prod", ["clean", "config:prod", "requirejs", "sass"]);
  grunt.registerTask("default", ["dev"]);

};
