(function() {
  "use strict";

  require.config({
    baseUrl: "../bower_components",
    paths: {
      simplelayout: "../scripts/simplelayout",
      toolbox: "../scripts/toolbox",
      jquery: "jquery/dist/jquery",
      jqueryui: "jquery-ui/ui",
      matchHeight: "../bower_components/matchHeight/jquery.matchHeight",
      jsrender: "../bower_components/jsrender/jsrender"
    },
    shim: {
      "matchHeight": {
          exports: "jQuery.fn.matchHeight"
      },
      "jsrender": {
          exports: "jQuery.fn.templates"
      }
    }
  });
}());
