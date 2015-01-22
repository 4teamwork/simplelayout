define(['simplelayout/Block'], function(Block) {

  'use strict';

  function Column(column) {
    if (!(this instanceof Column)) {
      throw new TypeError("Column constructor cannot be called as a function.");
    }

    var blockId = 0;

    var template = $.templates("<div class='sl-column sl-col-{{:column}}'></div>");

    return {

      blocks : {},

      getElement: function() {
        return this.element;
      },

      create : function() {
        this.element = $(template.render({column : column}));
      },

      insertBlock: function(height, content) {
        var id = blockId;
        var block = new Block(height, content);
        block.create();
        block.getElement().data('block-id', id);
        block.getElement().data('column-id', this.getElement().data('column-id'));
        block.getElement().data('layout-id', this.getElement().data('layout-id'));
        this.getElement().append(block.getElement());
        this.blocks[id] = block;
        blockId++;
        return id;
      },

      deleteBlock: function(blockId) {
        if(!this.blocks[blockId]) {
          throw new Error('No block with id ' + blockId + ' inserted.');
        }
        this.blocks[blockId].getElement().remove();
        delete this.blocks[blockId];
      },

      commitBlocks: function() {
        if(Object.keys(this.getCommittedBlocks()).length === Object.keys(this.getBlocks()).length) {
          throw new Error('No blocks inserted.');
        }
        for(var key in this.blocks) {
          this.blocks[key].committed = true;
        }
      },

      getCommittedBlocks: function() {
        var committedBlocks = {};
        for(var key in this.blocks) {
          if(this.blocks[key].committed) {
            committedBlocks[key] = this.blocks[key];
          }
        }
        return committedBlocks;
      },

      getBlocks: function() {
        return this.blocks;
      },

      toJSON : function() {
        return {blocks : this.blocks};
      }

    };
  }

  return Column;

});
