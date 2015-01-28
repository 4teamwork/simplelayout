define(["simplelayout/Layout"], function(Layout) {

  'use strict';

  function Layoutmanager(_options) {

    if (!(this instanceof Layoutmanager)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }

    var options = $.extend({
      width : '100%'
    }, _options || {});

    var element = $("<div>").addClass('sl-simplelayout').css('width', options.width);

    var layoutId = 0;

    return {

      layouts: {},

      minImageWidth: null,

      options : options,

      element : element,

      attachTo: function(target) {
        target.append(element);
      },

      getElement: function() {
        return this.element;
      },

      insertLayout: function(columns) {
        var id = layoutId;
        var layout = new Layout(columns);
        layout.create(id);
        layout.getElement().data('layout-id', id);
        element.append(layout.getElement());
        this.layouts[id] = layout;
        layoutId++;
        this.element.trigger("layoutInserted", [id]);
        return id;
      },

      deleteLayout: function(layoutId) {
        this.layouts[layoutId].getElement().remove();
        delete this.layouts[layoutId];
        this.element.trigger("layoutDeleted");
      },

      commitLayouts: function() {
        for (var key in this.layouts) {
          this.layouts[key].committed = true;
        }
        this.element.trigger("layoutsCommitted");
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

      getLayouts: function() {
        return this.layouts;
      },

      insertBlock: function(layoutId, columnId, content) {
        var layout = this.layouts[layoutId];
        var blockId = layout.insertBlock(columnId, content);
        this.layouts[layoutId].getColumns()[columnId].getBlocks()[blockId].getElement().find('img').width(this.minImageWidth);
        this.element.trigger("blockInserted", [layoutId, columnId, blockId]);
        return blockId;
      },

      deleteBlock: function(layoutId, columnId, blockId) {
        var layout = this.layouts[layoutId];
        layout.deleteBlock(columnId, blockId);
        this.element.trigger("blockDeleted");
      },

      commitBlocks: function(layoutId, columnId) {
        this.getLayouts()[layoutId].commitBlocks(columnId);
        this.element.trigger("blocksCommitted", [layoutId, columnId]);
      },

      moveBlock: function(oldLayoutId, oldColumnId, blockId, newLayoutId, newColumnId) {
        var layout = this.getLayouts()[oldLayoutId];
        var column = layout.getColumns()[oldColumnId];
        var block = column.getBlocks()[blockId];
        block.getElement().data('layoutId', newLayoutId);
        block.getElement().data('columnId', newColumnId);
        delete column.getBlocks()[blockId];
        this.getLayouts()[newLayoutId].getColumns()[newColumnId].getBlocks()[blockId] = block;
        this.element.trigger("blockMoved", [oldLayoutId, oldColumnId, blockId, newLayoutId, newColumnId]);
      },

      serialize: function() {
        var that = this;
        var output = {"layouts" : [], "blocks" : []};
        $('.sl-layout', this.element).each(function(layoutIdx, layout) {
          output.layouts.push(Object.keys(that.getLayouts()[$(layout).data('layoutId')].getColumns()).length);
          $('.sl-column', layout).each(function(columnIdx, column) {
            $('.sl-block', column).each(function(blockIdx, blockNode) {
              blockNode = $(blockNode);
              var blockId = blockNode.data('blockId');
              var columnId = blockNode.data('columnId');
              var layoutId = blockNode.data('layoutId');
              var block = that.getLayouts()[layoutId].getColumns()[columnId].getBlocks()[blockId];
              var blockData = {};
              blockData.layoutPos = layoutIdx;
              blockData.columnPos = columnIdx;
              blockData.blockPos = blockIdx;
              output.blocks.push(blockData);
            });
          });
        });
        return JSON.stringify(output);
      },

      deserialize :function(input) {
        var that = this;
        input = JSON.parse(input);
        $.each(input.layouts, function(idx, layout) {
          that.insertLayout(layout);
        });
        that.commitLayouts();
        $.each(input.blocks, function(idx, block) {
          that.insertBlock(block.layoutPos, block.columnPos);
          that.commitBlocks(block.layoutPos, block.columnPos);
        });
        this.element.trigger('deserialized');
      }

    };

  }

  return Layoutmanager;

});
