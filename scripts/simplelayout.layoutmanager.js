define(["jquery", "config", "app/simplelayout.blockbuilder", "app/simplelayout.utils", "packery", "jqueryui/droppable"], function($, CONFIG, builder, utils, Packery) {

  var layoutmanager = {},
    layout = null,
    pckry = null,
    currentBlock = null,
    layoutSettings = {
      itemSelector: CONFIG.blocks,
      columnWidth: utils.getGrid().x,
      gutter: 0
    },
    dropSettings = {
      drop: function(e, ui) {
        dropBlock(e, ui);
      },
      over: function(e, ui) {
        placeBlock(e, ui);
      },
      out: function(e, ui) {
        cancel(e, ui);
      }
    },
    bindEvents = function() {
      unbindEvents();
      layout.droppable(dropSettings);
      pckry.on('dragItemPositioned', function(pckryInstance, draggedItem) {
        //fitPosition(draggedItem);
        window.setTimeout(function() {pckry.layout()}, 100);
      });
    },
    unbindEvents = function() {
      if (layout.droppable('instance')) {
        layout.droppable('destroy');
      }
      pckry.off('dragItemPositioned');
    },
    placeBlock = function(e, ui) {
      if ($(ui.draggable).hasClass('tb-component')) {
        currentBlock = generateBlock($(ui.draggable));
        layout.prepend(currentBlock);
        pckry.prepended(currentBlock);
        pckry.bindUIDraggableEvents(currentBlock);
      }
    },
    generateBlock = function(component) {
      var type = component.attr('data-type');
      var block = builder.build(type);
      block.css('width', utils.getGrid().x);
      return block;
    },
    dropBlock = function(e, ui) {
      currentBlock = null;
    },
    cancel = function(e, ui) {
      if (currentBlock) {
        currentBlock.remove();
      }
    },
    fitPosition = function(draggedObject) {
      var draggedElement = $(draggedObject.element);
      var elemns = layout.children();
      var elemInSameColumn = $.grep(elemns, function(elm, idx) {
        var $elm = $(elm);
        return $elm.offset().left === draggedObject.position.x || $elm.offset().left + $elm.width() - draggedElement.width() === draggedObject.position.x;
      });
      if (elemInSameColumn.length === 1) {
        draggedElement.css('top', 0);
        return;
      }
      var sortetOffset = elemInSameColumn.sort(function(a, b) {
        return $(a).offset().top - $(b).offset().top;
      });
      var sumHeight = 0;
      $.each(sortetOffset, function(idx, elm) {
        var $elm = $(elm);
        if (idx === 0) {
          $elm.css('top', 0);
        } else {
          sumHeight += $(sortetOffset[idx - 1]).height();
          $elm.css('top', sumHeight);
        }
      });
      return;
    },
    setUp = function() {
      layout.css('width', CONFIG.contentwidth);
      pckry = new Packery(layout[0], layoutSettings);
      bindEvents();
    };

  layoutmanager.observe = function(element) {
    layout = element;
    setUp();
  };

  return layoutmanager;

});
