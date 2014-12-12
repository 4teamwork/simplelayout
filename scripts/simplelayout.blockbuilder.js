define(["jquery", "config", "renderer"], function($, CONFIG) {

  var blockbuilder = {};

  blockbuilder.build = function(type, data) {
    var blockTempl = $.templates(CONFIG.templates[type]);
    return blockTempl.render(data);
  };

  return blockbuilder;

});