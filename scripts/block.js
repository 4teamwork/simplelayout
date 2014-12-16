define(["jquery", "config", "app/simplelayout.utils", "jqueryui/draggable", "jqueryui/resizable"], function($, CONFIG, utils) {

  var block = null,
  dragSettings = {
      zIndex: 100
    },
    resizeSettings = {
      handles: "se",
      grid: [utils.getGrid().x, utils.getGrid().y],
      resize: function(e, ui) {
        $(ui.element).addClass('ui-resizing');
        block.trigger('resize');
      },
      stop: function(e, ui) {
        $(ui.element).removeClass('ui-resizing');
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
