define(["simplelayout/Layout"], function(Layout) {

  'use strict';

  function Layoutmanager(_options) {

    if (!(this instanceof Layoutmanager)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }

    var options = $.extend({
      width : '100%',
      blockHeight : '100px',
    }, _options || {});

    var element = $("<div>").addClass('sl-simplelayout').css('width', options.width);

    var layoutId = 0;

    return {

      layouts: {},

      minImageWidth: null,

      options : options,

      attachTo: function(target) {
        target.append(element);
      },

      getElement: function() {
        return element;
      },

      insertLayout: function(columns) {
        var id = layoutId;
        var layout = new Layout(columns);
        layout.create(id);
        layout.getElement().data('layout-id', id);
        element.append(layout.getElement());
        this.layouts[id] = layout;
        layoutId++;
        return id;
      },

      deleteLayout: function(layoutId) {
        this.layouts[layoutId].getElement().remove();
        delete this.layouts[layoutId];
      },

      commitLayouts: function() {
        for (var key in this.layouts) {
          this.layouts[key].committed = true;
        }
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

      insertBlock: function(layoutId, columnId, blocktype, content, height) {
        var blockHeight = height || this.options.blockHeight;
        var layout = this.layouts[layoutId];
        var blockId = layout.insertBlock(columnId, blocktype, content, blockHeight);
        this.layouts[layoutId].getColumns()[columnId].getBlocks()[blockId].getElement().find('img').width(this.minImageWidth);
        return blockId;
      },

      deleteBlock: function(layoutId, columnId, blockId) {
        var layout = this.layouts[layoutId];
        layout.deleteBlock(columnId, blockId);
      },

      commitBlocks: function(layoutId, columnId) {
        this.getLayouts()[layoutId].commitBlocks(columnId);
      },

      moveBlock: function(oldLayoutId, oldColumnId, blockId, newLayoutId, newColumnId) {
        var layout = this.getLayouts()[oldLayoutId];
        var column = layout.getColumns()[oldColumnId];
        var block = column.getBlocks()[blockId];
        block.getElement().data('layoutId', newLayoutId);
        block.getElement().data('columnId', newColumnId);
        delete column.getBlocks()[blockId];
        this.getLayouts()[newLayoutId].getColumns()[newColumnId].getBlocks()[blockId] = block;
      },

      serialize: function() {
        return JSON.stringify({layouts : this.layouts, options : this.options});
      },

      deserialize :function(serializedObjects) {
        var layoutStructure = JSON.parse(serializedObjects);
        this.options = layoutStructure.options;
        for(var layout in layoutStructure.layouts) {
          var layoutId = this.insertLayout(Object.keys(layoutStructure.layouts[layout].columns).length);
          this.commitLayouts();
          for(var column in layoutStructure.layouts[layout].columns) {
            for(var blockKey in layoutStructure.layouts[layout].columns[column].blocks) {
              var block = layoutStructure.layouts[layout].columns[column].blocks[blockKey];
              this.insertBlock(layout, column, block, block.type, block.height);
              this.commitBlocks(layout, column);
            }
          }
        }
      }

    };

  }

  return Layoutmanager;

});
