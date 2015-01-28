define(['simplelayout/Layoutmanager', 'simplelayout/Eventrecorder', 'simplelayout/Toolbar'], function(Layoutmanager, Eventrecorder, Toolbar) {

  'use strict';

  function Simplelayout(_options) {

    if (!(this instanceof Simplelayout)) {
      throw new TypeError("Simplelayout constructor cannot be called as a function.");
    }

    var options = $.extend({
      imageCount: 1
    }, _options || {});

    var eventrecorder = new Eventrecorder();

    var layoutmanager = new Layoutmanager(_options);

    var toolbox = null;

    var blockToCreateOptions = {};

    var currentBlock = null;

    var TOOLBOX_COMPONENT_DRAGGABLE_SETTINGS = {
      helper: "clone",
      cursor: "pointer",
      start: function(e, ui) {
        if ($(e.target).hasClass('sl-toolbox-component') && Object.keys(layoutmanager.getLayouts()).length === 0) {
          columns = toolbox.options.layouts[0];
          layoutId = layoutmanager.insertLayout(columns);
          layoutmanager.commitLayouts();
        }
        blockToCreateOptions = $(e.target).data();
      }
    };

    var TRASH_DROPPABLE_SETTINGS = {
      accept: '.sl-layout, .sl-block',
      tolerance: 'touch',
      over: function(e, ui) {
        var layoutId;
        if (ui.draggable.hasClass('sl-layout')) {
          layoutId = ui.draggable.data('layout-id');
          var layout = layoutmanager.getLayouts()[layoutId];
          var hasBlocks = false;
          for (var key in layout.getColumns()) {
            if (Object.keys(layout.getColumns()[key].getBlocks()).length > 0) {
              hasBlocks = true;
              break;
            }
          }
          layout.getElement().addClass('deleted');
          if (hasBlocks) {
            layout.getElement().addClass('cancelDeletion');
          }
        } else {
          layoutId = ui.draggable.data('layout-id');
          var columnId = ui.draggable.data('column-id');
          var blockId = ui.draggable.data('block-id');
          var block = layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId];
          block.getElement().addClass('deleted');
        }
      },
      drop: function(e, ui) {
        var layoutId;
        if (ui.draggable.hasClass('sl-layout')) {
          layoutId = ui.draggable.data('layout-id');
          var layout = layoutmanager.getLayouts()[layoutId];
          if (!layout.getElement().hasClass('cancelDeletion')) {
            layoutmanager.deleteLayout(layoutId);
          }
          layout.getElement().removeClass('deleted cancelDeletion');
        } else {
          layoutId = ui.draggable.data('layout-id');
          var columnId = ui.draggable.data('column-id');
          var blockId = ui.draggable.data('block-id');
          var block = layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId];
          layoutmanager.deleteBlock(layoutId, columnId, blockId);
        }
      },
      out: function(e, ui) {
        var layoutId;
        if (ui.draggable.hasClass('sl-layout')) {
          layoutId = ui.draggable.data('layout-id');
          var layout = layoutmanager.getLayouts()[layoutId];
          layout.getElement().removeClass('deleted cancelDeletion');
        } else {
          layoutId = ui.draggable.data('layout-id');
          var columnId = ui.draggable.data('column-id');
          var blockId = ui.draggable.data('block-id');
          var block = layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId];
          block.getElement().removeClass('deleted');
        }
      }
    };

    var LAYOUTMANAGER_SORTABLE_SETTINGS = {
      connectWith: '.sl-simplelayout',
      items: '.sl-layout',
      handle: '.sl-column',
      placeholder: "placeholder",
      forcePlaceholderSize: true,
    };

    var LAYOUT_SORTABLE_SETTINGS = {
      connectWith: '.sl-column',
      placeholder: "placeholder",
      forcePlaceholderSize: true,
      handle: '.move',
      tolerance : 'pointer',
      receive: function(e, ui) {
        if (ui && ui.item) {
          var target = $(e.target);
          var columnId = ui.item.data('column-id');
          var layoutId = ui.item.data('layout-id');
          var blockId = ui.item.data('block-id');
          var type = ui.item.data('type');
          var content = ui.item.html();
          var newColumnId = target.data('column-id');
          var newLayoutId = target.data('layout-id');
          layoutmanager.moveBlock(layoutId, columnId, blockId, newLayoutId, newColumnId, type, content);
        }
      },
    };

    var LAYOUT_DROPPABLE_SETTINGS = {
      accept: '.sl-toolbox-component',
      over: function(e, ui) {
        try {
          var layoutId = $(this).parent().data('layout-id');
          var columnId = $(this).data('column-id');
          var blockId = layoutmanager.insertBlock(layoutId, columnId, null, null);
          e.data = {
            blockId: blockId,
            columnId: columnId,
            layoutId: layoutId
          };
          eventrecorder.record(e);
        } catch (err) {}
      },
      out: function(e) {
        try {
          var originalOverEventData = eventrecorder.lookup(e).data;
          layoutmanager.deleteBlock(originalOverEventData.layoutId, originalOverEventData.columnId, originalOverEventData.blockId);
        } catch (err) {}
      },
      drop: function(e) {
        try {
          var originalOverEventData = eventrecorder.lookup(e).data;
          layoutmanager.commitBlocks(originalOverEventData.layoutId, originalOverEventData.columnId);
          layoutmanager.getLayouts()[originalOverEventData.layoutId].getElement().find('.sl-column').sortable('refresh');
          eventrecorder.flush();
        } catch (err) {}
      }
    };

    var LAYOUTMANAGER_DROPPABLE_SETTINGS = {
      accept: ".sl-toolbox-layout",
      over: function(e, ui) {
        try {
          var columns = ui.draggable.data('columns');
          var layoutId = layoutmanager.insertLayout(columns);
          e.data = {
            layoutId: layoutId
          };
          eventrecorder.record(e);
        } catch (err) {}
      },
      out: function(e) {
        try {
          layoutmanager.deleteLayout(eventrecorder.lookup(e).data.layoutId);
        } catch (err) {}
      },
      drop: function(e) {
        try {
          var originalOverEventData = eventrecorder.lookup(e).data;
          layoutmanager.commitLayouts();
          layoutmanager.getLayouts()[originalOverEventData.layoutId].getElement().find('.sl-layout').sortable('refresh');
          eventrecorder.flush();
        } catch (err) {}
      }
    };

    var TOOLBOX_DRAGGABLE_SETTINGS = {
      cursor: "pointer",
      containment: 'window',
      handle: '.sl-toolbox-handle'
    };

    var bindLayoutEvents = function() {
      var layoutId;
      var columnId;
      var blockId;
      layoutmanager.getElement().droppable(LAYOUTMANAGER_DROPPABLE_SETTINGS);
      layoutmanager.getElement().sortable(LAYOUTMANAGER_SORTABLE_SETTINGS);
      on('blockInserted', function(event, layoutId, columnId, blockId) {
        var block = layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId];
        var toolbar = new Toolbar(blockToCreateOptions.actions);
        block.attachToolbar(toolbar);
      });
      layoutmanager.getElement().on('mouseover', '.sl-block', function() {
        layoutId = $(this).data('layoutId');
        columnId = $(this).data('columnId');
        blockId = $(this).data('blockId');
        currentBlock = layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId];
        currentBlock.getToolbar().show();
      }).on('mouseout', '.sl-block', function() {
        layoutId = $(this).data('layoutId');
        columnId = $(this).data('columnId');
        blockId = $(this).data('blockId');
        layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId].getToolbar().hide();
      }).on('mousedown', '.sl-block', function() {
        layoutId = $(this).data('layoutId');
        columnId = $(this).data('columnId');
        blockId = $(this).data('blockId');
        layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId].getToolbar().keepVisible(true);
      }).on('mouseup', '.sl-block', function() {
        layoutId = $(this).data('layoutId');
        columnId = $(this).data('columnId');
        blockId = $(this).data('blockId');
        layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId].getToolbar().keepVisible(false);
      });
    };

    var bindToolboxEvents = function() {
      toolbox.getElement().find('.sl-toolbox-component, .sl-toolbox-layout').draggable(TOOLBOX_COMPONENT_DRAGGABLE_SETTINGS);
      toolbox.getElement().find('.sl-toolbox-trash').droppable(TRASH_DROPPABLE_SETTINGS);

      layoutmanager.getElement().on('layoutInserted', function(e, layoutId) {
        layoutmanager.getLayouts()[layoutId].getElement().find('.sl-column').droppable(LAYOUT_DROPPABLE_SETTINGS).sortable(LAYOUT_SORTABLE_SETTINGS);
      });

      toolbox.getElement().draggable(TOOLBOX_DRAGGABLE_SETTINGS);

    };

    var on = function(eventType, callback) {
      layoutmanager.getElement().on(eventType, function() {
        callback.apply(this, arguments);
      });
    };

    bindLayoutEvents();

    return {

      options: options,

      getLayoutmanager: function() {
        return layoutmanager;
      },

      getEventrecorder: function() {
        return eventrecorder;
      },

      getToolbox: function() {
        return toolbox;
      },

      attachTo: function(target) {
        layoutmanager.attachTo(target);
      },

      attachToolbox: function(toolboxRef) {
        if (!toolboxRef) {
          throw new Error('No toolbox defined');
        }
        if (layoutmanager.getElement().parent().length === 0) {
          throw new Error('Not attached to DOM element');
        }
        toolbox = toolboxRef;
        layoutmanager.minImageWidth = layoutmanager.getElement().width() / Math.max.apply(null, toolbox.options.layouts) / this.options.imageCount;
        bindToolboxEvents();
      },

      on : on,

      getCurrentBlock : function() {
        return currentBlock;
      }

    };

  }

  return Simplelayout;

});
