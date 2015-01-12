define(["simplelayout/Layout"], function(Layout) {

  'use strict';

  function Layoutmanager() {

    if (!(this instanceof Layoutmanager)) {
      throw new TypeError("Layoutmanager constructor cannot be called as a function.");
    }

    var element = $("<div>").addClass('sl-simplelayout');

    var layoutId = 0;

    return {

      layouts: {},

      minImageWidth: null,

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

      insertBlock: function(layoutId, columnId, blocktype, content) {
        var layout = this.layouts[layoutId];
        var blockId = layout.insertBlock(columnId, blocktype, content);
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
        var block = this.getLayouts()[oldLayoutId].getColumns()[oldColumnId].getBlocks()[blockId];
        var type = block.getElement().data('type');
        var content = block.getElement().children('.sl-block-content').html();
        this.deleteBlock(oldLayoutId, oldColumnId, blockId);
        var newBlockId = this.insertBlock(newLayoutId, newColumnId, type, content);
        this.commitBlocks(newLayoutId, newColumnId);
        return newBlockId;
      },

      serialize: function() {
        return JSON.stringify({layouts : this.layouts});
      }

    };

  }

  return Layoutmanager;

});
