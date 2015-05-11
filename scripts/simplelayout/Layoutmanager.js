define(["simplelayout/Layout"], function(Layout) {

  "use strict";

  function Layoutmanager(_options) {

    if (!(this instanceof Layoutmanager)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }

    var options = $.extend({ width: "100%" }, _options || {});

    var element;

    if (options.source) {
      element = $(options.source);
      element.addClass("sl-simplelayout");

    } else {
      var template = $.templates("<div class='sl-simplelayout' style='width:{{:width}};''></div>");
      element = $(template.render(options));
    }

    return {

      layouts: [],

      options: options,

      element: element,

      attachTo: function(target) {
        $(target).append(element);
      },

      insertLayout: function(columns) {
        var layout = new Layout(columns);
        this.layouts.push(layout);
        var id = this.layouts.length - 1;
        layout.create(id);
        this.element.trigger("layoutInserted", [id]);
        return id;
      },

      deleteLayout: function(layoutId) {
        console.log(this.layouts);
        console.log(layoutId);
        this.layouts[layoutId].element.remove();
        this.layouts.splice(layoutId, 1);
        this.element.trigger("layoutDeleted");
      },

      commitLayouts: function() {
        $.each(this.layouts, function(i, layout) {
          layout.commit();
        });
        this.element.trigger("layoutsCommitted");
      },

      getCommittedLayouts: function() {
        return $.grep(this.layouts, function(layout) {
          return layout.committed;
        });
      },

      getBlock: function(layoutId, columnId, blockId) {
        return this.layouts[layoutId].getBlock(columnId, blockId);
      },

      hasBlocks: function() {
        var hasBlocks = false;
        $.each(this.layouts, function(i, layout) {
          if(layout.hasBlocks()) {
            hasBlocks = true;
            return false;
          }
        });
        return hasBlocks;
      },

      hasLayouts: function() {
        return this.layouts.length > 0;
      },

      getCommittedBlocks: function() {
        var committedBlocks = [];
        $.each(this.layouts, function(i, layout) {
          committedBlocks = $.merge(layout.getCommittedBlocks(), committedBlocks);
        });
        return committedBlocks;
      },

      getInsertedBlocks: function() {
        var insertedBlocks = [];
        $.each(this.layouts, function(i, layout) {
          insertedBlocks = $.merge(layout.getInsertedBlocks(), insertedBlocks);
        });
        return insertedBlocks;
      },

      setBlock: function(layoutId, columnId, blockId, block) {
        this.layouts[layoutId].setBlock(columnId, blockId, block);
      },

      insertBlock: function(layoutId, columnId, content, type) {
        var layout = this.layouts[layoutId];
        var blockId = layout.insertBlock(columnId, content, type);
        this.element.trigger("blockInserted", [layoutId, columnId, blockId]);
        return blockId;
      },

      deleteBlock: function(layoutId, columnId, blockId) {
        var layout = this.layouts[layoutId];
        layout.deleteBlock(columnId, blockId);
        this.element.trigger("blockDeleted", [layoutId, columnId, blockId]);
      },

      commitBlocks: function(layoutId, columnId) {
        this.layouts[layoutId].commitBlocks(columnId);
        this.element.trigger("blocksCommitted", [layoutId, columnId]);
      },

      moveLayout: function(layoutId) {
        this.element.trigger("layoutMoved", [layoutId]);
      },

      moveBlock: function(oldLayoutId, oldColumnId, oldBlockId, newLayoutId, newColumnId) {
        var layout = this.layouts[oldLayoutId];
        var column = layout.columns[oldColumnId];
        var block = column.blocks[oldBlockId];
        var nextBlockId = this.layouts[newLayoutId].columns[newColumnId].blocks.length;
        block.element.data("layoutId", newLayoutId);
        block.element.data("columnId", newColumnId);
        block.element.data("blockId", nextBlockId);
        column.blocks.splice(oldBlockId, 1);
        this.layouts[newLayoutId].columns[newColumnId].blocks[nextBlockId] = block;
        this.element.trigger("blockMoved", [oldLayoutId, oldColumnId, oldBlockId, newLayoutId, newColumnId, nextBlockId]);
      },

      serialize: function() {
        var that = this;
        var output = {
          "layouts": [],
          "blocks": []
        };
        $(".sl-layout", this.element).each(function(layoutIdx, layout) {
          output.layouts.push(Object.keys(that.layouts[$(layout).data("layoutId")].columns).length);
          $(".sl-column", layout).each(function(columnIdx, column) {
            $(".sl-block", column).each(function(blockIdx, blockNode) {
              blockNode = $(blockNode);
              var uid = blockNode.data("uid");
              var blockData = {};
              blockData.layoutPos = layoutIdx;
              blockData.columnPos = columnIdx;
              blockData.blockPos = blockIdx;
              blockData.uid = uid;
              output.blocks.push(blockData);
            });
          });
        });
        return JSON.stringify(output);
      },

      deserialize: function() {
        var Column = require("simplelayout/Column");
        var Block = require("simplelayout/Block");
        var Toolbar = require("simplelayout/Toolbar");
        var toolbar;
        var that = this;
        $(".sl-layout", element).each(function(layoutIdx, layout) {
          var layoutNode = $(layout);
          that.layouts[layoutIdx] = new Layout(layoutNode.children(".sl-column").length);
          that.layouts[layoutIdx].element = layoutNode;
          that.layouts[layoutIdx].element.data("layoutId", layoutIdx);
          var layoutToolbar = new Toolbar(that.toolbox.options.layoutActions, "vertical", "layout");
          that.layouts[layoutIdx].attachToolbar(layoutToolbar);
          that.id++;
          $(".sl-column", layout).each(function(columnIdx, column) {
            var columnNode = $(column);
            that.layouts[layoutIdx].columns[columnIdx] = new Column(layoutNode.children(".sl-column").length);
            that.layouts[layoutIdx].columns[columnIdx].element = columnNode;
            that.layouts[layoutIdx].columns[columnIdx].element.data("layoutId", layoutIdx);
            that.layouts[layoutIdx].columns[columnIdx].element.data("columnId", columnIdx);
            $(".sl-block", column).each(function(blockIdx, block) {
              var blockNode = $(block);
              that.setBlock(layoutIdx, columnIdx, blockIdx, new Block());
              that.getBlock(layoutIdx, columnIdx, blockIdx).element = blockNode;
              that.getBlock(layoutIdx, columnIdx, blockIdx).type = blockNode.data("type");
              toolbar = new Toolbar(that.toolbox.options.components[blockNode.data("type")].actions, "horizontal", "block");
              that.getBlock(layoutIdx, columnIdx, blockIdx).attachToolbar(toolbar);
              that.getBlock(layoutIdx, columnIdx, blockIdx).element.data("layoutId", layoutIdx);
              that.getBlock(layoutIdx, columnIdx, blockIdx).element.data("columnId", columnIdx);
              that.getBlock(layoutIdx, columnIdx, blockIdx).element.data("blockId", blockIdx);
            });
          });
        });
      }
    };

  }

  return Layoutmanager;

});
