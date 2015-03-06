define(["simplelayout/Layoutmanager", "simplelayout/Eventrecorder", "simplelayout/Toolbar"], function(Layoutmanager, Eventrecorder, Toolbar) {

  "use strict";

  function Simplelayout(_options) {

    if (!(this instanceof Simplelayout)) {
      throw new TypeError("Simplelayout constructor cannot be called as a function.");
    }

    var options = _options || {};

    var eventrecorder = new Eventrecorder();

    var layoutmanager = new Layoutmanager(_options);

    var toolbox = null;

    var blockToCreateOptions = {};

    var currentBlock = null;

    var currentLayout = null;

    var TOOLBOX_COMPONENT_DRAGGABLE_SETTINGS = {
      helper: "clone",
      cursor: "pointer",
      start: function(e) {
        if ($(e.target).hasClass("sl-toolbox-component") && Object.keys(layoutmanager.layouts).length === 0) {
          layoutmanager.insertLayout(toolbox.options.layouts[0]);
          layoutmanager.commitLayouts();
        }
        blockToCreateOptions = $(e.target).data();
      }
    };

    var LAYOUTMANAGER_SORTABLE_SETTINGS = {
      connectWith: ".sl-simplelayout",
      items: ".sl-layout",
      handle: ".sl-toolbar-layout .move",
      placeholder: "placeholder",
      tolerance: "touch",
      forcePlaceholderSize: true
    };

    var LAYOUT_SORTABLE_SETTINGS = {
      connectWith: ".sl-column",
      placeholder: "placeholder",
      forcePlaceholderSize: true,
      handle: ".sl-toolbar-block .move",
      tolerance: "pointer",
      receive: function(e, ui) {
        if (ui && ui.item) {
          var target = $(e.target);
          var columnId = ui.item.data("column-id");
          var layoutId = ui.item.data("layout-id");
          var blockId = ui.item.data("block-id");
          var type = ui.item.data("type");
          var content = ui.item.html();
          var newColumnId = target.data("column-id");
          var newLayoutId = target.data("layout-id");
          layoutmanager.moveBlock(layoutId, columnId, blockId, newLayoutId, newColumnId, type, content);
        }
      }
    };

    var LAYOUT_DROPPABLE_SETTINGS = {
      accept: ".sl-toolbox-component",
      over: function(e, ui) {
        try {
          var layoutId = $(this).parent().data("layout-id");
          var columnId = $(this).data("column-id");
          var blockId = layoutmanager.insertBlock(layoutId, columnId, null, ui.draggable.data("type"));
          var blockToolbar = new Toolbar(toolbox.options.components[ui.draggable.data("type")].actions, "horizontal", "block");
          layoutmanager.getBlock(layoutId, columnId, blockId).attachToolbar(blockToolbar);
          e.data = { blockId: blockId, columnId: columnId, layoutId: layoutId };
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
          layoutmanager.layouts[originalOverEventData.layoutId].element.find(".sl-column").sortable("refresh");
          eventrecorder.flush();
        } catch (err) {}
      }
    };

    var LAYOUTMANAGER_DROPPABLE_SETTINGS = {
      accept: ".sl-toolbox-layout",
      over: function(e, ui) {
        try {
          var columns = ui.draggable.data("columns");
          var layoutId = layoutmanager.insertLayout(columns);
          var layoutToolbar = new Toolbar(toolbox.options.layoutActions, "vertical", "layout");
          layoutmanager.layouts[layoutId].attachToolbar(layoutToolbar);
          e.data = { layoutId: layoutId };
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
          layoutmanager.layouts[originalOverEventData.layoutId].element.find(".sl-layout").sortable("refresh");
          eventrecorder.flush();
        } catch (err) {}
      }
    };

    var TOOLBOX_DRAGGABLE_SETTINGS = {
      cursor: "pointer",
      containment: "window",
      handle: ".sl-toolbox-handle"
    };

    var on = function(eventType, callback) {
      layoutmanager.element.on(eventType, function() {
        callback.apply(this, arguments);
      });
    };

    var bindLayoutEvents = function() {
      var layoutId;
      var columnId;
      var blockId;
      var data;
      layoutmanager.element.droppable(LAYOUTMANAGER_DROPPABLE_SETTINGS);
      layoutmanager.element.sortable(LAYOUTMANAGER_SORTABLE_SETTINGS);
      layoutmanager.element.find(".sl-column").droppable(LAYOUT_DROPPABLE_SETTINGS).sortable(LAYOUT_SORTABLE_SETTINGS);
      layoutmanager.element.on("layoutInserted", function(e, insertedLayout) {
        layoutmanager.layouts[insertedLayout].element.find(".sl-column").sortable(LAYOUT_SORTABLE_SETTINGS);
        layoutmanager.layouts[insertedLayout].element.find(".sl-column").droppable(LAYOUT_DROPPABLE_SETTINGS);
      });
      on("blockInserted", function(event, insertedLayout, insertedColumn, insertedBlock) {
        var block = layoutmanager.getBlock(insertedLayout, insertedColumn, insertedBlock);
        var toolbar = new Toolbar(blockToCreateOptions.actions);
        block.attachToolbar(toolbar);
      });
      layoutmanager.element.on("mouseover", ".sl-block", function() {
          data = $(this).data();
          layoutId = data.layoutId;
          columnId = data.columnId;
          blockId = data.blockId;
          currentBlock = layoutmanager.getBlock(layoutId, columnId, blockId);
      });
      layoutmanager.element.on("mouseover", ".sl-layout", function() {
          data = $(this).data();
          layoutId = data.layoutId;
          currentLayout = layoutmanager.layouts[layoutId];
      });
    };

    var bindToolboxEvents = function() {
      toolbox.element.find(".sl-toolbox-component, .sl-toolbox-layout").draggable(TOOLBOX_COMPONENT_DRAGGABLE_SETTINGS);
      toolbox.element.draggable(TOOLBOX_DRAGGABLE_SETTINGS);
    };

    bindLayoutEvents();

    return {

      options: options,

      getCurrentBlock: function() {
        return currentBlock;
      },

      getCurrentLayout: function() {
        return currentLayout;
      },

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
          throw new Error("No toolbox defined");
        }
        if (layoutmanager.element.parent().length === 0) {
          throw new Error("Not attached to DOM element");
        }
        toolbox = toolboxRef;
        layoutmanager.toolbox = toolbox;
        bindToolboxEvents();
      },

      on: on,

      bindEvents: function() {
        bindLayoutEvents();
        bindToolboxEvents();
      }

    };

  }

  return Simplelayout;

});
