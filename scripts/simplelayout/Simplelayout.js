define(['simplelayout/Layoutmanager', 'simplelayout/Eventrecorder'], function(Layoutmanager, Eventrecorder) {

  'use strict';

  function Simplelayout(_options) {

    if (!(this instanceof Simplelayout)) {
      throw new TypeError("Simplelayout constructor cannot be called as a function.");
    }

    var options = $.extend({
      imageCount : 1
    }, _options || {});

    var eventrecorder = new Eventrecorder();

    var layoutmanager = new Layoutmanager();

    var toolbox;

    var BLOCK_RESIZABLE_SETTINGS = {
      handles: "s"
    };

    var TOOLBOX_DRAGGABLE_SETTINGS = {
      helper: "clone",
      cursor: "pointer"
    };

    var TRASH_DROPPABLE_SETTINGS = {
      accept: '.sl-layout, .sl-block',
      tolerance: 'touch',
      over: function(e, ui) {
        if(ui.draggable.hasClass('sl-layout')) {
          var layoutId = ui.draggable.data('layout-id');
          var layout = layoutmanager.getLayouts()[layoutId];
          var hasBlocks = false;
          for(var key in layout.getColumns()) {
            if(Object.keys(layout.getColumns()[key].getBlocks()).length > 0) {
              hasBlocks = true;
              break;
            }
          }
          layout.getElement().addClass('deleted');
          if(hasBlocks) {
            layout.getElement().addClass('cancelDeletion');
          }
        } else {
          var layoutId = ui.draggable.data('layout-id');
          var columnId = ui.draggable.data('column-id');
          var blockId = ui.draggable.data('block-id');
          var block = layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId];
          block.getElement().addClass('deleted');
        }
      },
      drop: function(e, ui) {
        if(ui.draggable.hasClass('sl-layout')) {
          var layoutId = ui.draggable.data('layout-id');
          var layout = layoutmanager.getLayouts()[layoutId];
          if(!layout.getElement().hasClass('cancelDeletion')){
            layoutmanager.deleteLayout(layoutId);
          }
          layout.getElement().removeClass('deleted cancelDeletion');
        } else {
          var layoutId = ui.draggable.data('layout-id');
          var columnId = ui.draggable.data('column-id');
          var blockId = ui.draggable.data('block-id');
          var block = layoutmanager.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId];
          layoutmanager.deleteBlock(layoutId, columnId, blockId);
        }
      },
      out: function(e, ui) {
        if(ui.draggable.hasClass('sl-layout')) {
          var layoutId = ui.draggable.data('layout-id');
          var layout = layoutmanager.getLayouts()[layoutId];
          layout.getElement().removeClass('deleted cancelDeletion');
        } else {
          var layoutId = ui.draggable.data('layout-id');
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
      placeholder: "placeholder",
      forcePlaceholderSize: true,
    };

    var LAYOUT_SORTABLE_SETTINGS = {
      connectWith: '.sl-column, .tb-trash',
      placeholder: "placeholder",
      forcePlaceholderSize: true,
      tolerance: 'pointer',
      distance: 1,
      receive : function(e, ui) {
        var target = $(e.target);
        var columnId = ui.item.data('column-id');
        var layoutId = ui.item.data('layout-id');
        var blockId = ui.item.data('block-id');
        var type = ui.item.data('type');
        var content = ui.item.html();
        var newColumnId = target.data('column-id');
        var newLayoutId = target.data('layout-id');
        var newBlockId = layoutmanager.moveBlock(layoutId, columnId, blockId, newLayoutId, newColumnId, type, content);
        var block = layoutmanager.getLayouts()[newLayoutId].getColumns()[newColumnId].getBlocks()[newBlockId].getElement();
        block.resizable(BLOCK_RESIZABLE_SETTINGS);
      },
    };

    var LAYOUT_DROPPABLE_SETTINGS = {
      accept: '.sl-toolbox-component',
      over: function(e, ui) {
        try {
          var layoutId = $(this).parent().data('layout-id');
          var columnId = $(this).data('column-id');
          var type = ui.draggable.data('type');
          var blockId = layoutmanager.insertBlock(layoutId, columnId, type, '<p>I am a block</p>');
          e.data = {blockId : blockId, columnId : columnId, layoutId : layoutId};
          eventrecorder.record(e);
        } catch(err) {}
      },
      out: function(e) {
        try {
          var originalOverEventData = eventrecorder.lookup(e).data;
          layoutmanager.deleteBlock(originalOverEventData.layoutId, originalOverEventData.columnId, originalOverEventData.blockId);
        } catch(err) {}
      },
      drop: function(e) {
        try {
          var originalOverEventData = eventrecorder.lookup(e).data;
          layoutmanager.commitBlocks(originalOverEventData.layoutId, originalOverEventData.columnId);
          layoutmanager.getLayouts()[originalOverEventData.layoutId].getElement().find('.sl-column').sortable('refresh');
          var block = layoutmanager.getLayouts()[originalOverEventData.layoutId].getColumns()[originalOverEventData.columnId].getBlocks()[originalOverEventData.blockId];
          block.getElement().resizable(BLOCK_RESIZABLE_SETTINGS);
          eventrecorder.flush();
        } catch(err) {}
      }
    };

    var LAYOUTMANAGER_DROPPABLE_SETTINGS = {
      accept: ".sl-toolbox-layout",
      over: function(e, ui) {
        try {
          var columns = ui.draggable.data('columns');
          var layoutId = layoutmanager.insertLayout(columns);
          e.data = {layoutId : layoutId};
          eventrecorder.record(e);
          layoutmanager.getLayouts()[layoutId].getElement().find('.sl-column').droppable(LAYOUT_DROPPABLE_SETTINGS).sortable(LAYOUT_SORTABLE_SETTINGS);
        } catch(err) {}
      },
      out: function(e) {
        try {
        layoutmanager.deleteLayout(eventrecorder.lookup(e).data.layoutId);
        } catch(err) {}
      },
      drop: function(e) {
        try {
          var originalOverEventData = eventrecorder.lookup(e).data;
          layoutmanager.commitLayouts();
          layoutmanager.getLayouts()[originalOverEventData.layoutId].getElement().find('.sl-layout').sortable('refresh');
          eventrecorder.flush();
        } catch(err) {}
      }
    };

    var bindLayoutEvents = function() {
      unbindLayoutEvents();
      layoutmanager.getElement().droppable(LAYOUTMANAGER_DROPPABLE_SETTINGS);
      layoutmanager.getElement().sortable(LAYOUTMANAGER_SORTABLE_SETTINGS);
    };

    var unbindLayoutEvents = function() {
      if(layoutmanager.getElement().droppable('instance')) {
        layoutmanager.getElement().droppable('destroy');
      }

      if(layoutmanager.getElement().sortable('instance')) {
        layoutmanager.getElement().sortable('destroy');
      }
    };

    var bindToolboxEvents = function() {
      unbindToolboxEvents();
      toolbox.getElement().find('.sl-toolbox-component, .sl-toolbox-layout').draggable(TOOLBOX_DRAGGABLE_SETTINGS);
      toolbox.getElement().find('.sl-toolbox-trash').droppable(TRASH_DROPPABLE_SETTINGS);
    };

    var unbindToolboxEvents = function() {
      if(toolbox.getElement().find('.sl-toolbox-component, .sl-toolbox-layout').draggable('instance')) {
        toolbox.getElement().find('.sl-toolbox-component, .sl-toolbox-layout').draggable('destroy');
      }
      if(toolbox.getElement().find('.sl-toolbox-trash').droppable('instance')) {
        toolbox.getElement().find('.sl-toolbox-trash').droppable('destroy');
      }
    };

    bindLayoutEvents();

    return {

      options : options,

      getLayoutmanager : function() {
        return layoutmanager;
      },

      getEventrecorder : function() {
        return eventrecorder;
      },

      getToolbox : function() {
        return toolbox;
      },

      attachTo : function(target) {
        layoutmanager.attachTo(target);
      },

      attachToolbox : function(toolboxRef) {
        if(!toolboxRef) {
          throw new Error('No toolbox defined');
        }
        if(layoutmanager.getElement().parent().length === 0) {
          throw new Error('Not attached to DOM element');
        }
        toolbox = toolboxRef;
        layoutmanager.minImageWidth = layoutmanager.getElement().width() / Math.max.apply(null, toolbox.options.layouts) / this.options.imageCount;
        bindToolboxEvents();
      }

    };

  }

  return Simplelayout;

});
