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
      cursor: "pointer"
    };

    var LAYOUTMANAGER_SORTABLE_SETTINGS = {
      connectWith: ".sl-simplelayout",
      items: ".sl-layout",
      handle: ".sl-toolbar-layout .move",
      placeholder: "placeholder",
      layoutId: null,
      tolerance: "touch",
      forcePlaceholderSize: true,
      clone: null,
      start: function(event, ui) {
        if(typeof ui.item.data("layoutId") === "undefined") {
          this.layoutId = layoutmanager.insertLayout(ui.item.data("columns"));
          var layoutToolbar = new Toolbar(toolbox.options.layoutActions, "vertical", "layout");
          layoutmanager.layouts[this.layoutId].attachToolbar(layoutToolbar);
          layoutmanager.layouts[this.layoutId].element.insertAfter(ui.placeholder);
        }
      },
      out: function(event, ui) {
        if(typeof ui.item.data("layoutId") === "undefined") {
          layoutmanager.layouts[this.layoutId].element.detach();
          try {
            eventrecorder.lookup(event);
            layoutmanager.deleteLayout(this.layoutId);
          } catch(e) {}
        }
      },
      stop: function(event, ui) {
        if(typeof ui.item.data("layoutId") === "undefined") {
          eventrecorder.record(event);
          var item = $(this).find(".ui-draggable");
          layoutmanager.layouts[this.layoutId].element.insertAfter(item);
          item.remove();
          layoutmanager.commitLayouts();
          eventrecorder.flush();
        } else {
          layoutmanager.moveLayout(ui.item.data("layoutId"));
        }
      },
      change: function(event, ui) {
        if(typeof ui.item.data("layoutId") === "undefined") {
          layoutmanager.layouts[this.layoutId].element.detach();
          layoutmanager.layouts[this.layoutId].element.insertAfter(ui.placeholder);
        }
      }
    };

    var LAYOUT_SORTABLE_SETTINGS = {
      connectWith: ".sl-column",
      placeholder: "placeholder",
      layoutId: null,
      columnId: null,
      blockId: null,
      start: function(event, ui) {
        if(typeof ui.item.data("blockId") === "undefined") {
          this.layoutId = $(this).data("layoutId");
          this.columnId = $(this).data("columnId");
          var type = ui.item.data("type");
          this.blockId = layoutmanager.insertBlock(this.layoutId, this.columnId, null, type);
          var blockToolbar = new Toolbar(toolbox.options.components[type].actions, "horizontal", "block");
          layoutmanager.getBlock(this.layoutId, this.columnId, this.blockId).attachToolbar(blockToolbar);
          layoutmanager.getBlock(this.layoutId, this.columnId, this.blockId).element.insertAfter(ui.placeholder);
        }
      },
      out: function(event, ui) {
        if(typeof ui.item.data("blockId") === "undefined") {
          layoutmanager.getBlock(this.layoutId, this.columnId, this.blockId).element.detach();
          try {
            eventrecorder.lookup(event);
            layoutmanager.deleteBlock(this.layoutId, this.columnId, this.blockId);
          } catch(e) {}
        }
      },
      stop: function(event, ui) {
        if(typeof ui.item.data("blockId") === "undefined") {
          eventrecorder.record(event);
          var item = $(this).find(".ui-draggable");
          layoutmanager.getBlock(this.layoutId, this.columnId, this.blockId).element.insertAfter(item);
          item.remove();
          layoutmanager.commitBlocks(this.layoutId, this.columnId);
          eventrecorder.flush();
        } else {
          var layoutId = ui.item.data("layoutId");
          var columnId = ui.item.data("columnId");
          var blockId = ui.item.data("blockId");
          var type = ui.item.data("type");
          var content = ui.item.html();
          layoutmanager.moveBlock(layoutId, columnId, blockId, layoutId, columnId, type, content);
        }
      },
      change: function(event, ui) {
        if(typeof ui.item.data("blockId") === "undefined") {
          layoutmanager.getBlock(this.layoutId, this.columnId, this.blockId).element.detach();
          layoutmanager.getBlock(this.layoutId, this.columnId, this.blockId).element.insertAfter(ui.placeholder);
        }
      },
      forcePlaceholderSize: true,
      handle: ".sl-toolbar-block .move",
      tolerance: "pointer",
      receive: function(e, ui) {
        if (ui && ui.item && typeof ui.item.data("blockId") !== "undefined") {
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

    var bindToolboxEvents = function() {
      toolbox.element.find(".sl-toolbox-component, .sl-toolbox-layout").draggable(TOOLBOX_COMPONENT_DRAGGABLE_SETTINGS);
      toolbox.element.find(".sl-toolbox-layout").draggable("option", "connectToSortable", ".sl-simplelayout");
      toolbox.element.find(".sl-toolbox-component").draggable("option", "connectToSortable", ".sl-column");
      toolbox.element.draggable(TOOLBOX_DRAGGABLE_SETTINGS);
    };

    var bindLayoutEvents = function() {
      var layoutId;
      var columnId;
      var blockId;
      var data;
      layoutmanager.element.sortable(LAYOUTMANAGER_SORTABLE_SETTINGS);
      $(".sl-column").sortable(LAYOUT_SORTABLE_SETTINGS);
      on("layoutsCommitted", function() {
        $(".sl-column").sortable(LAYOUT_SORTABLE_SETTINGS);
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

    bindLayoutEvents();

    return {

      options: options,

      getActiveBlock: function() {
        return currentBlock;
      },

      getActiveLayout: function() {
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
