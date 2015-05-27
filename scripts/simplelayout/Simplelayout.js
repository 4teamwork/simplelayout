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

    var insertManager = function(managerOptions) {
      var manager = new Layoutmanager(managerOptions);
      manager.element.data("container", id);
      managers[id] = manager;
      id++;
      return manager;
    };

    $(options.source).each(function(idx, container) { insertManager({ source: container }); });

    var TOOLBOX_COMPONENT_DRAGGABLE_SETTINGS = { helper: "clone", cursor: "pointer" };

    var LAYOUTMANAGER_SORTABLE_SETTINGS = {
      connectWith: ".sl-simplelayout",
      items: ".sl-layout",
      handle: ".sl-toolbar-layout .move",
      placeholder: "layout-placeholder",
      axis: "y",
      forcePlaceholderSize: true,
      receive: function(event, ui) {
        var manager = managers[$(this).data("container")];
        var item = $(this).find(".ui-draggable");
        var layout = manager.insertLayout(ui.item.data("columns"));
        var layoutToolbar = new Toolbar(toolbox.options.layoutActions, "vertical", "layout");
        layout.attachToolbar(layoutToolbar);
        layout.element.insertAfter(item);
        item.remove();
        manager.commitLayouts();
      },
      update: function(event, ui) {
        if(typeof ui.item.data("layoutId") !== "undefined") {
          var manager = managers[$(this).data("container")];
          manager.moveLayout(ui.item.data("layoutId"));
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
          var data = originalBlock.element.data();
          var newData = $(this).data();
          var originalLayoutId = data.layoutId;
          var originalColumnId = data.columnId;
          var originalBlockId = data.blockId;
          var newLayoutId = newData.layoutId;
          var newColumnId = newData.columnId;
          var newContainerId = newData.container;
          originalBlock.element.data("layoutId", newLayoutId);
          originalBlock.element.data("columnId", newColumnId);
          originalBlock.element.data("container", newContainerId);
          manager.layouts[originalLayoutId].columns[originalColumnId].blocks[originalBlockId] = originalBlock;
        }
        else if(typeof ui.item.data("layoutId") === "undefined") {
          var item = $(this).find(".ui-draggable");
          var layoutId = $(this).data("layoutId");
          var columnId = $(this).data("columnId");
          var type = ui.item.data("type");
          var block = manager.insertBlock(layoutId, columnId, null, type);
          var blockToolbar = new Toolbar(toolbox.options.components[type].actions, "horizontal", "block");
          block.attachToolbar(blockToolbar);
          block.element.insertAfter(item);
          item.remove();
          manager.commitBlocks(layoutId, columnId);
        }
      },
      remove: function(event, ui) {
        var columnId = ui.item.data("columnId");
        var layoutId = ui.item.data("layoutId");
        var blockId = ui.item.data("blockId");
        var manager = managers[$(this).data("container")];
        originalBlock = manager.getBlock(layoutId, columnId, blockId);
        delete manager.layouts[layoutId].columns[columnId].blocks[blockId];
      },
      update: function(event, ui) {
        if(typeof ui.item.data("layoutId") !== "undefined" && !originalBlock) {
          var manager = managers[$(this).data("container")];
          var target = $(event.target);
          var columnId = ui.item.data("columnId");
          var layoutId = ui.item.data("layoutId");
          var blockId = ui.item.data("blockId");
          var newColumnId = target.data("columnId");
          var newLayoutId = target.data("layoutId");
          manager.moveBlock(layoutId, columnId, blockId, newLayoutId, newColumnId);
        } else {
          originalBlock = null;
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

    return {

      managers: managers,

      options: options,

      insertManager: insertManager,

      getActiveBlock: function() { return currentBlock; },

      getActiveLayout: function() { return currentLayout; },

      serialize: function() { return JSON.stringify(this.managers); },

      deserialize: function(objectString) {
        var self = this;
        managers = {};
        id = 0;
        var objectStructure = JSON.parse(objectString);
        $.each(objectStructure, function(idx, manager) {
          self.insertManager().toObject(manager.layouts);
        });
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
        $.each(this.managers, function(idx, manager) {
          manager.attachTo(target);
        });
      },

      attachToolbox: function(toolboxRef) {
        if (!toolboxRef) {
          throw new Error("No toolbox defined");
        }
        if (managers[0].element.parent().length === 0) {
          throw new Error("Not attached to DOM element");
        }
        toolbox = toolboxRef;
        $.each(this.managers, function(idx, manager) {
          manager.toolbox = toolbox;
        });
        bindToolboxEvents();
      },

      on: on

    };

  }

  return Simplelayout;

});
