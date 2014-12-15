define(["jquery", "config", "app/block", "renderer"], function($, CONFIG, Block) {

  var blockbuilder = {};

  blockbuilder.build = function(type, data) {
    var blockTempl = $.templates(CONFIG.templates[type]);
    return new Block(blockTempl.render(data));
  };

  return blockbuilder;

});