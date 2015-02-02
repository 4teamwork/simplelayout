define(["simplelayout/Layout"], function(Layout) {

  'use strict';

  function Layoutmanager(_options) {

    if (!(this instanceof Layoutmanager)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }

    var options = $.extend({
      width : '100%'
    }, _options || {});

    var element;

    if(options.source) {
      element = $(_options.source);
    } else {
      var template = $.templates('<div class="sl-simplelayout" style="width:{{:width}};"></div>');
      element = $(template.render(options));
    }

    return {

      layouts: {},

      id : 0,

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
        var id = this.id;
        var layout = new Layout(columns);
        layout.create(id);
        element.append(layout.getElement());
        this.layouts[id] = layout;
        this.id++;
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

      insertBlock: function(layoutId, columnId, content, type) {
        var layout = this.layouts[layoutId];
        var blockId = layout.insertBlock(columnId, content, type);
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

      moveBlock: function(oldLayoutId, oldColumnId, oldBlockId, newLayoutId, newColumnId) {
        var layout = this.getLayouts()[oldLayoutId];
        var column = layout.getColumns()[oldColumnId];
        var block = column.getBlocks()[oldBlockId];
        var nextBlockId = Object.keys(this.getLayouts()[newLayoutId].getColumns()[newColumnId].getBlocks()).length;
        block.getElement().data('layoutId', newLayoutId);
        block.getElement().data('columnId', newColumnId);
        block.getElement().data('blockId', nextBlockId);
        delete column.getBlocks()[oldBlockId];
        this.getLayouts()[newLayoutId].getColumns()[newColumnId].getBlocks()[nextBlockId] = block;
        this.element.trigger("blockMoved", [oldLayoutId, oldColumnId, oldBlockId, newLayoutId, newColumnId, nextBlockId]);
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

      deserialize: function() {
        var Layout = require('simplelayout/Layout');
        var Column = require('simplelayout/Column');
        var Block = require('simplelayout/Block');
        var Toolbar = require('simplelayout/Toolbar');
        var toolbar;
        var that = this;
        $('.sl-layout', element).each(function(layoutIdx, layout) {
          that.layouts[layoutIdx] = new Layout($(layout).children('.sl-column').length);
          that.layouts[layoutIdx].element = $(layout);
          that.layouts[layoutIdx].getElement().data('layoutId', layoutIdx);
          that.id++;
          $('.sl-column', layout).each(function(columnIdx, column) {
            that.layouts[layoutIdx].getColumns()[columnIdx] = new Column($(layout).children('.sl-column').length);
            that.layouts[layoutIdx].getColumns()[columnIdx].element = $(column);
            that.layouts[layoutIdx].getColumns()[columnIdx].getElement().data('layoutId', layoutIdx);
            that.layouts[layoutIdx].getColumns()[columnIdx].getElement().data('columnId', columnIdx);
            $('.sl-block', column).each(function(blockIdx, block) {
              that.layouts[layoutIdx].getColumns()[columnIdx].getBlocks()[blockIdx] = new Block();
              that.layouts[layoutIdx].getColumns()[columnIdx].getBlocks()[blockIdx].element = $(block);
              that.layouts[layoutIdx].getColumns()[columnIdx].getBlocks()[blockIdx].type = $(block).data('type');
              toolbar = new Toolbar(that.toolbox.options.components[$(block).data('type')].actions);
              that.layouts[layoutIdx].getColumns()[columnIdx].getBlocks()[blockIdx].attachToolbar(toolbar);
              that.layouts[layoutIdx].getColumns()[columnIdx].getBlocks()[blockIdx].getElement().data('layoutId', layoutIdx);
              that.layouts[layoutIdx].getColumns()[columnIdx].getBlocks()[blockIdx].getElement().data('columnId', columnIdx);
              that.layouts[layoutIdx].getColumns()[columnIdx].getBlocks()[blockIdx].getElement().data('blockId', blockIdx);
            });
          });
        });
        console.log(this.layouts);
      }
    };

  }

  return Layoutmanager;

});
