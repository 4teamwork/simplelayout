define(['simplelayout/Block'], function(Block) {

  'use strict';

  function Column(column) {
    if (!(this instanceof Column)) {
      throw new TypeError("Column constructor cannot be called as a function.");
    }

    if(!column){
      throw new Error("Columns are not defined.");
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
        return this.element;
      },

      insertBlock: function(content, type) {
        var id = blockId;
        var block = new Block(content, type);
        var blockElement = block.create();
        blockElement.data('block-id', id);
        blockElement.data('columnId', this.getElement().data('columnId'));
        blockElement.data('layoutId', this.getElement().data('layoutId'));
        this.getElement().append(blockElement);
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
