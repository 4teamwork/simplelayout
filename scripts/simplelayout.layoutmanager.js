define(["jquery", "config", "app/simplelayout.blockbuilder", "app/simplelayout.utils", "packery", "jqueryui/droppable"], function($, CONFIG, builder, utils, Packery) {

  var layoutmanager = {},
    layout = null,
    pckry = null,
    currentBlock = null,
    newPosition = null,
    originalOffset = null,
    once = null,
    canvas = null,
    ctx = null,
    layoutSettings = {
      itemSelector: CONFIG.blocks,
      columnWidth: utils.getGrid().x,
      gutter: CONFIG.gutter,
      transitionDuration: CONFIG.transitionDuration + "ms"
    },
    dropSettings = {
      drop: function(e, ui) {
        dropBlock();
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
        if (once) {
          if (draggedItem.hasToFix) {
            fixPosition();
          }
          rearrange();
          once = !once;
        }

      });
      pckry.on('layoutComplete', function(pckryInstance, laidOutItems) {
        drawSpaces();
      });
    },
    unbindEvents = function() {
      if (layout.droppable('instance')) {
        layout.droppable('destroy');
      }
      pckry.off('dragItemPositioned');
      pckry.off('layoutComplete');
    },
    placeBlock = function(e, ui) {
      if ($(ui.draggable).hasClass('tb-component')) {
        currentBlock = generateBlock($(ui.draggable));
        layout.append(currentBlock);
        pckry.appended(currentBlock);
        pckry.bindUIDraggableEvents(currentBlock);
      }
    },
    generateBlock = function(component) {
      var type = component.attr('data-type');
      var block = builder.build(type);
      var offsetTopRect;
      var draggedElement;
      block.on('resize', function() {
        pckry.layout();
      });
      block.on('dragstop', function(e) {
        draggedElement.css('z-index', 1);
        offsetRect = getOffsetRect();
        if (offsetRect.height === Number.POSITIVE_INFINITY) {
          offsetRect.y = draggedElement.offset().top;
          offsetRect.x = draggedElement.offset().left;
        }
        newPosition = {
          el: this,
          x: offsetRect.x,
          y: draggedElement.offset().top - offsetRect.height
        };
        // Element is not dragged in y direction
        if (draggedElement.offset().top === originalOffset.top) {
          draggedElement[0].hasToFix = false;
        }
        // A dragItemPositioned event will be fired manually when element is dragged arround the borders
        else if (originalOffset.left + draggedElement.width() === CONFIG.contentwidth || originalOffset.top !== originalOffset.top || originalOffset.left === 0) {
          draggedElement[0].hasToFix = true;
        }
        pckry.trigger('dragItemPositioned', [pckry, draggedElement[0]]);
      });
      block.on('dragstart', function(e) {
        draggedElement = $(this);
        draggedElement.css('z-index', 2);
        once = true;
        originalOffset = draggedElement.offset();
      });
      block.css('width', utils.getGrid().x);
      return block;
    },
    dropBlock = function() {
      currentBlock = null;
    },
    cancel = function(e, ui) {
      if (currentBlock) {
        pckry.remove(currentBlock[0]);
        rearrange();
      }
    },
    fixPosition = function() {
      pckry.fit(newPosition.el, newPosition.x, newPosition.y);
    },
    rearrange = function() {
      window.setTimeout(function() {
        pckry.layout();
      }, CONFIG.transitionDuration * 2);
    },
    drawSpaces = function() {
      canvas.width = pckry.size.width;
      canvas.height = pckry.size.height;
      ctx.clearRect(0, 0, pckry.size.width, pckry.size.height);
      var spaces = pckry.packer.spaces;
      ctx.fillStyle = CONFIG.dropzonecolor;
      for (var i = 0, len = spaces.length; i < len; i++) {
        var space = spaces[i];
        var height = Math.min(space.height, canvas.height - space.y);
        ctx.fillRect(space.x, space.y, space.width, height);
      }
    },
    getOffsetRect = function() {
      sortedSpaces = pckry.packer.spaces.sort(function(a, b) {
        return a.height - b.height;
      });
      return sortedSpaces[0];
    },
    setUp = function() {
      layout.css('width', CONFIG.contentwidth);
      pckry = new Packery(layout[0], layoutSettings);
      canvas = document.createElement('canvas');
      layout.append(canvas);
      ctx = canvas.getContext('2d');
      rearrange();
      bindEvents();
    };

  layoutmanager.observe = function(element) {
    layout = element;
    setUp();
  };

  return layoutmanager;

});
