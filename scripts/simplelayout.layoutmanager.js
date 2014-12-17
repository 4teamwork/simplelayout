define(["jquery", "config", "app/simplelayout.blockbuilder", "app/simplelayout.utils", "packery", "jqueryui/droppable"], function($, CONFIG, builder, utils, Packery) {

  var layoutmanager = {},
    layout = null,
    dpckry = null,
    currentBlock = null,
    newPosition = null,
    originalOffset = null,
    once = null,
    layoutSettings = {
      itemSelector: CONFIG.blocks,
      columnWidth: utils.getGrid().x,
      //rowHeight : utils.getGrid().y,
      gutter: CONFIG.gutter,
      transitionDuration: CONFIG.transitionDuration + "ms"
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
        if (once) {
          if(draggedItem.hasToFix){
            fixPosition();
          }
          rearrange();
          once = !once;
        }

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
        layout.append(currentBlock);
        pckry.appended(currentBlock);
        pckry.bindUIDraggableEvents(currentBlock);
        if(currentBlock.offset().top > parseInt($(window).height()) - 200) {
          window.scrollTo(0,document.body.scrollHeight);
        }
      }
    },
    generateBlock = function(component) {
      var type = component.attr('data-type');
      var block = builder.build(type);
      block.on('resize', function() {
        pckry.layout();
      });
      block.on('dragstop', function(e) {
        var sortedSpaces = pckry.packer.spaces.sort(function(a, b) {
          return a.height - b.height;
        });
        var draggedElement = $(this);
        if(sortedSpaces[0].height === Number.POSITIVE_INFINITY) {
          sortedSpaces[0].y = draggedElement.offset().top;
          sortedSpaces[0].x = draggedElement.offset().left;
        }
        newPosition = {
          el: this,
          x: sortedSpaces[0].x,
          y: sortedSpaces[0].y
        };
        if(draggedElement.offset().top === originalOffset.top) {
          draggedElement[0].hasToFix = false;
        }
        else if (draggedElement.offset().left + draggedElement.width() === CONFIG.contentwidth || draggedElement.offset().top !== originalOffset.top || draggedElement.offset().left === 0) {
          draggedElement[0].hasToFix = true;
        }
        pckry.trigger('dragItemPositioned', [pckry, draggedElement[0]]);
      });
      block.on('dragstart', function(e) {
        once = true;
        originalOffset = $(this).offset();
      });
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
    fixPosition = function() {
      pckry.fit(newPosition.el, newPosition.x, newPosition.y);
    },
    rearrange = function() {
      window.setTimeout(function() {
        pckry.layout();
      }, CONFIG.transitionDuration * 2);
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
