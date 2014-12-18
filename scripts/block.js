define(["jquery", "config", "app/simplelayout.utils", "jqueryui/resizable"], function($, CONFIG, utils) {

  var block = null,
    resizableSettings = {
      handles: "s",
      grid: [utils.getGrid().x, utils.getGrid().y],
      start: function(e, ui) {
        $(ui.element).css('z-index', 2);
      },
      stop: function(e, ui) {
        $(ui.element).css('z-index', 1);
      },
      minWidth: utils.getGrid().x
    };

  return function Block(body) {
    if (!body) {
      throw "InvalidArgumentException: " + body;
    }

    block = $(body);
    block.resizable(resizableSettings);
    return block;
  };

});
