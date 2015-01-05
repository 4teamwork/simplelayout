requirejs.config({
  baseUrl: '../bower_components',
  paths: {
    app: "../scripts",
    jquery: "jquery/dist/jquery",
    jqueryui: "jquery-ui/ui",
    config: "../scripts/config",
    renderer : "jsrender/jsrender"
  },
  shim: {
    'renderer': {
        deps: [ 'jquery' ],
        exports: 'jQuery.fn.templates'
    }
  }
});

var assert = chai.assert;
chai.config.truncateThreshold = 0;