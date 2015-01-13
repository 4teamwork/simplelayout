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

      insertBlock: function(layoutId, columnId, blocktype, content, height) {
        var blockHeight = height || this.options.blockHeight;
        var layout = this.layouts[layoutId];
        var blockId = layout.insertBlock(columnId, blocktype, content, blockHeight);
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
        return JSON.stringify({layouts : this.layouts});
      },

      deserialize :function(serializedObjects) {
        var layoutStructure = JSON.parse(serializedObjects);
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
        this.element.trigger('deserialized');
      }

    };

  }

  return Layoutmanager;

});
