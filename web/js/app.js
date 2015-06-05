require.config({
  "baseUrl": "js/lib/",
  "paths": {
    "app": "../app",
    "EventEmitter": "eventEmitter/EventEmitter.min",
    "jquery": "jquery/dist/jquery",
    "jqueryui": "jquery-ui/ui/minified/jquery-ui.custom.min",
    "jsrender": "jsrender/jsrender.min"
  },
  "shim": {
    "jsrender": {
      "deps": ["jquery"],
      "exports": "jQuery.fn.template"
    },
    "jqueryui": {
      "deps": ["jquery"]
    }
  }
});
require(["app/main"]);