define(["simplelayout/Layoutmanager", "simplelayout/Toolbar"], function(Layoutmanager, Toolbar) {

  "use strict";

  function Simplelayout(_options) {

    if (!(this instanceof Simplelayout)) {
      throw new TypeError("Simplelayout constructor cannot be called as a function.");
    }

    var options = _options || {};

    var managers = {};

    var toolbox = null;

    var currentBlock = null;

    var currentLayout = null;

    var id = 0;

    var moveLayout = function(oldManagerId, oldLayoutId, newManagerId) {
      var manager = managers[oldManagerId];
      var layout = manager.layouts[oldLayoutId];
      var nextLayoutId = Object.keys(managers[newManagerId].layouts).length;
      $.extend(layout.element.data(), { layoutId: nextLayoutId, container: newManagerId });
      delete manager.layouts[oldLayoutId];
      managers[newManagerId].layouts[nextLayoutId] = layout;
      managers[newManagerId].moveLayout(oldLayoutId, nextLayoutId);
    };

    var TOOLBOX_COMPONENT_DRAGGABLE_SETTINGS = { helper: "clone", cursor: "pointer" };

    var originalLayout;
    var canMove = true;

    var LAYOUTMANAGER_SORTABLE_SETTINGS = {
      connectWith: ".sl-simplelayout",
      items: ".sl-layout",
      handle: ".sl-toolbar-layout .move",
      placeholder: "layout-placeholder",
      axis: "y",
      forcePlaceholderSize: true,
      receive: function(event, ui) {
        var manager = managers[$(this).data("container")];
        if(originalLayout) {
          moveLayout(originalLayout.element.data("container"), originalLayout.element.data("layoutId"), $(this).data("container"));
          originalLayout = null;
        } else {
          var item = $(this).find(".ui-draggable");
          var layout = manager.insertLayout({ columns: ui.item.data("columns") });
          layout.element.insertAfter(item);
          item.remove();
          manager.commitLayouts();
        }
        canMove = false;
      },
      remove: function(event, ui) { originalLayout = managers[$(this).data("container")].layouts[ui.item.data("layoutId")]; },
      start: function() { canMove = true; },
      stop: function(event, ui) {
        if(canMove) {
          var itemData = ui.item.data();
          managers[itemData.container].element.trigger("layoutMoved");
        }
      }
    };

    var originalBlock;


    var LAYOUT_SORTABLE_SETTINGS = {
      connectWith: ".sl-column",
      placeholder: "block-placeholder",
      forcePlaceholderSize: true,
      handle: ".sl-toolbar-block .move",
      tolerance: "pointer",
      receive: function(event, ui) {
        var manager = managers[$(this).data("container")];
        if(originalBlock) {
          var newData = $(this).data();
          var nextBlockId = Object.keys(manager.layouts[newData.layoutId].columns[newData.columnId].blocks).length;
          $.extend(originalBlock.element.data(), newData);
          manager.layouts[newData.layoutId].columns[newData.columnId].blocks[nextBlockId] = originalBlock;
          manager.element.trigger("blockMoved", [this, manager, nextBlockId]);
          originalBlock = null;
        }
        else if(typeof ui.item.data("layoutId") === "undefined") {
          var item = $(this).find(".ui-draggable");
          var data = $(this).data();
          var type = ui.item.data("type");
          var block = manager.insertBlock(data.layoutId, data.columnId, null, type);
          var blockToolbar = new Toolbar(toolbox.options.components[type].actions, "horizontal", "block");
          block.attachToolbar(blockToolbar);
          block.element.insertAfter(item);
          item.remove();
        }
        canMove = false;
      },
      remove: function(event, ui) {
        var itemData = ui.item.data();
        originalBlock = managers[itemData.container].getBlock(itemData.layoutId, itemData.columnId, itemData.blockId);
        delete managers[itemData.container].layouts[itemData.layoutId].columns[itemData.columnId].blocks[itemData.blockId];
      },
      start: function() { canMove = true; },
      stop: function(event, ui) {
        if(canMove) {
          var itemData = ui.item.data();
          var data = $(this).data();
          managers[itemData.container].moveBlock(itemData.layoutId, itemData.columnId, itemData.blockId, data.layoutId, data.columnId);
        }
      }
    };

    var on = function(eventType, callback) {
      $(".sl-simplelayout").on(eventType, function() {
        callback.apply(this, arguments);
      });
    };

    var bindToolboxEvents = function() {
      toolbox.element.find(".sl-toolbox-component, .sl-toolbox-layout").draggable(TOOLBOX_COMPONENT_DRAGGABLE_SETTINGS);
      toolbox.element.find(".sl-toolbox-layout").draggable("option", "connectToSortable", ".sl-simplelayout");
      toolbox.element.find(".sl-toolbox-component").draggable("option", "connectToSortable", ".sl-column");
    };

    var bindLayoutEvents = function() {
      var managerId;
      var layoutId;
      var columnId;
      var blockId;
      var data;
      $(".sl-simplelayout").sortable(LAYOUTMANAGER_SORTABLE_SETTINGS);
      $(".sl-column").sortable(LAYOUT_SORTABLE_SETTINGS);
      on("layoutsCommitted", function() {
        $(".sl-column").sortable(LAYOUT_SORTABLE_SETTINGS);
      });
      $(".sl-simplelayout").on("mouseover", ".sl-block", function() {
          data = $(this).data();
          managerId = data.container;
          layoutId = data.layoutId;
          columnId = data.columnId;
          blockId = data.blockId;
          currentBlock = managers[managerId].getBlock(layoutId, columnId, blockId);
      });
      $(".sl-simplelayout").on("mouseover", ".sl-layout", function() {
          data = $(this).data();
          layoutId = data.layoutId;
          managerId = data.container;
          currentLayout = managers[managerId].layouts[layoutId];
      });
    };

    bindLayoutEvents();

    on("layoutInserted", function(event, manager, layout) {
      var layoutToolbar = new Toolbar(toolbox.options.layoutActions, "vertical", "layout");
      layout.attachToolbar(layoutToolbar);
    });

    on("blockInserted", function(event, column, block) {
      var blockToolbar = new Toolbar(toolbox.options.components[block.type].actions, "horizontal", "block");
      block.attachToolbar(blockToolbar);
    });

    return {

      options: options,

      moveLayout: moveLayout,

      getActiveBlock: function() { return currentBlock; },

      getActiveLayout: function() { return currentLayout; },

      getManagers: function() { return managers; },

      serialize: function() { return JSON.stringify(managers); },

      deserialize: function(target) {
        if(!toolbox) {
          throw new Error("Deserialize was called prior attaching a toolbox.");
        }
        managers = {};
        id = 0;
        var self = this;
        $(".sl-simplelayout", target).each(function(idx, e) {
          var manager = self.insertManager({ source: e });
          manager.deserialize();
        });
      },

      insertManager: function(managerOptions) {
        var manager = new Layoutmanager(managerOptions);
        manager.element.data("container", id);
        managers[id] = manager;
        id++;
        return manager;
      },

      getCommittedBlocks: function() {
        var committedBlocks = [];
        for(var key in this.managers) {
          committedBlocks = $.merge(this.managers[key].getCommittedBlocks(), committedBlocks);
        }
        return committedBlocks;
      },

      getToolbox: function() { return toolbox; },

      attachTo: function(target) {
        $.each(managers, function(idx, manager) {
          manager.attachTo(target);
        });
      },

      attachToolbox: function(toolboxRef) {
        if (!toolboxRef) {
          throw new Error("No toolbox defined");
        }
        toolbox = toolboxRef;
        $.each(managers, function(idx, manager) {
          manager.toolbox = toolbox;
        });
        bindToolboxEvents();
      },

      on: on

    };

  }

  return Simplelayout;

});
