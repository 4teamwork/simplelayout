define(["simplelayout/Layout"], function(Layout) {

  "use strict";

  function Layoutmanager(_options) {

    if (!(this instanceof Layoutmanager)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }

    var options = $.extend({ width: "100%" }, _options || {});

    var element;

    var id = 0;

    if (options.source) {
      element = $(options.source);
      element.addClass("sl-simplelayout");
    } else {
      var template = $.templates("<div class='sl-simplelayout' style='width:{{:width}};''></div>");
      element = $(template.render(options));
    }

    return {

      layouts: {},

      options: options,

      element: element,

      attachTo: function(target) { $(target).append(element); },

      insertLayout: function(columns) {
        var layout = new Layout(columns);
        layout.create(id, element.data("container"));
        this.layouts[id] = layout;
        this.element.trigger("layoutInserted", [this, layout]);
        id++;
        return layout;
      },

      deleteLayout: function(layoutId) {
        this.layouts[layoutId].element.remove();
        delete this.layouts[layoutId];
        this.element.trigger("layoutDeleted", [this]);
      },

      commitLayouts: function() {
        for (var key in this.layouts) {
          this.layouts[key].commit();
        }
        this.element.trigger("layoutsCommitted", [this]);
      },

      getCommittedLayouts: function() {
        var committedLayouts = {};
        for (var key in this.layouts) {
          if (this.layouts[key].committed) {
            committedLayouts[key] = this.layouts[key];
          }
        }
        return committedLayouts;
      },

      getBlock: function(layoutId, columnId, blockId) { return this.layouts[layoutId].columns[columnId].blocks[blockId]; },

      getCommittedBlocks: function() {
        var committedBlocks = [];
        for(var key in this.layouts) {
          committedBlocks = $.merge(this.layouts[key].getCommittedBlocks(), committedBlocks);
        }
        return committedBlocks;
      },

      getInsertedBlocks: function() {
        var insertedBlocks = [];
        for(var key in this.layouts) {
          insertedBlocks = $.merge(this.layouts[key].getInsertedBlocks(), insertedBlocks);
        }
        return insertedBlocks;
      },

      setBlock: function(layoutId, columnId, blockId, block) { this.layouts[layoutId].columns[columnId].blocks[blockId] = block; },

      insertBlock: function(layoutId, columnId, content, type) {
        var layout = this.layouts[layoutId];
        var block = layout.insertBlock(columnId, content, type);
        this.element.trigger("blockInserted", [this, block]);
        return block;
      },

      deleteBlock: function(layoutId, columnId, blockId) {
        var layout = this.layouts[layoutId];
        layout.deleteBlock(columnId, blockId);
        this.element.trigger("blockDeleted", [this, layoutId, columnId, blockId]);
      },

      commitBlocks: function(layoutId, columnId) {
        this.layouts[layoutId].commitBlocks(columnId);
        this.element.trigger("blocksCommitted", [this, layoutId, columnId]);
      },

      // Todo: implement move layout
      moveLayout: function(layoutId) {
        this.element.trigger("layoutMoved", [this, layoutId]);
      },

      hasLayouts: function() { return Object.keys(this.layouts).length > 0; },

      moveBlock: function(oldLayoutId, oldColumnId, oldBlockId, newLayoutId, newColumnId) {
        var layout = this.layouts[oldLayoutId];
        var column = layout.columns[oldColumnId];
        var block = column.blocks[oldBlockId];
        var nextBlockId = Object.keys(this.layouts[newLayoutId].columns[newColumnId].blocks).length;
        block.element.data("layoutId", newLayoutId);
        block.element.data("columnId", newColumnId);
        block.element.data("blockId", nextBlockId);
        delete column.blocks[oldBlockId];
        this.layouts[newLayoutId].columns[newColumnId].blocks[nextBlockId] = block;
        this.element.trigger("blockMoved", [this, oldLayoutId, oldColumnId, oldBlockId, newLayoutId, newColumnId, nextBlockId]);
      },

      toObject: function(layouts) {
        var self = this;
        $.each(layouts, function(idx, layout) {
          var layoutInstance = self.insertLayout(Object.keys(layout.columns).length);
          layoutInstance.toObject(layout.columns);
        });
      },

      toJSON: function() { return { layouts: this.layouts, container: this.element.attr("id") }; }
    };

  }

  return Layoutmanager;

});
