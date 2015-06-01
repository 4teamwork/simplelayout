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

      insertLayout: function(layoutOptions) {
        layoutOptions = $.extend({
          columns: 4
        }, layoutOptions || {});
        var columns = $(".sl-column", layoutOptions.source).length > 0 ? $(".sl-column", layoutOptions.source).length : layoutOptions.columns;
        var layout = new Layout(columns);
        layout.create(id, element.data("container"));
        if(layoutOptions.source) {
          var data = layout.element.data();
          layout.element = layoutOptions.source;
          $.extend(layout.element.data(), data);
        }
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

      setBlock: function(layoutId, columnId, blockId, block) { this.layouts[layoutId].columns[columnId].blocks[blockId] = block; },

      getBlock: function(layoutId, columnId, blockId) { return this.layouts[layoutId].columns[columnId].blocks[blockId]; },

      getBlocks: function() {
        var blocks = [];
        $.each(this.layouts, function(idx, layout) {
          blocks = $.merge(layout.getBlocks(), blocks);
        });
        return blocks;
      },

      insertBlock: function(layoutId, columnId, content, type) {
        var layout = this.layouts[layoutId];
        var block = layout.insertBlock(columnId, content, type);
        return block;
      },

      deleteBlock: function(layoutId, columnId, blockId) {
        var layout = this.layouts[layoutId];
        layout.deleteBlock(columnId, blockId);
        this.element.trigger("blockDeleted", [this, layoutId, columnId, blockId]);
      },

      moveLayout: function(oldLayout, newLayoutId) {
        var self = this;
        $.each(this.layouts[newLayoutId].columns, function(colIdx, column) {
          column.element.data("layoutId", newLayoutId);
          column.element.data("container", self.element.data("container"));
          $.each(column.blocks, function(bloIdx, block) {
            block.element.data("layoutId", newLayoutId);
            block.element.data("container", self.element.data("container"));
          });
        });
        this.element.trigger("layoutMoved", [this, newLayoutId]);
      },

      hasLayouts: function() { return Object.keys(this.layouts).length > 0; },

      moveBlock: function(oldLayoutId, oldColumnId, oldBlockId, newLayoutId, newColumnId) {
        var block = this.layouts[oldLayoutId].columns[oldColumnId].blocks[oldBlockId];
        var nextBlockId = Object.keys(this.layouts[newLayoutId].columns[newColumnId].blocks).length;
        $.extend(block.element.data(), { layoutId: newLayoutId, columnId: newColumnId, blockId: nextBlockId });
        delete this.layouts[oldLayoutId].columns[oldColumnId].blocks[oldBlockId];
        this.layouts[newLayoutId].columns[newColumnId].blocks[nextBlockId] = block;
        this.element.trigger("blockMoved", [this, oldLayoutId, oldColumnId, oldBlockId, newLayoutId, newColumnId, nextBlockId]);
      },

      deserialize: function() {
        var self = this;
        $(".sl-layout", this.element).each(function(idx, e) {
          e = $(e);
          var layout = self.insertLayout({ source: e });
          layout.deserialize();
        });
      },

      toJSON: function() { return { layouts: this.layouts, container: this.element.attr("id") }; }
    };

  }

  return Layoutmanager;

});
