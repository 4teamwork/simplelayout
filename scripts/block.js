define(["jquery", "config", "app/simplelayout.utils", "jqueryui/draggable", "jqueryui/resizable"], function($, CONFIG, utils) {

  var block = null,
  dragSettings = {
      zIndex: 100,
      containment : 'parent',
      cursor : 'pointer'
    },
    resizeSettings = {
      handles: "se",
      grid: [utils.getGrid().x, utils.getGrid().y],
      start : function(e, ui) {
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
    block.draggable(dragSettings);
    block.resizable(resizeSettings);
    return block;
  };

});
