define(["simplelayout/Block"], function(Block) {

  "use strict";

  function Column(column) {
    if (!(this instanceof Column)) {
      throw new TypeError("Column constructor cannot be called as a function.");
    }

    if (!column) { throw new Error("Columns are not defined."); }

    var template = $.templates("<div class='sl-column sl-col-{{:column}}''></div>");

    return {

      blocks: [],

      element: null,

      create: function() {
        this.element = $(template.render({ column: column }));
        return this.element;
      },

      insertBlock: function(content, type) {
        var nextBlockId = this.blocks.length;
        var block = new Block(content, type);
        var blockElement = block.create();
        blockElement.data("blockId", nextBlockId);
        blockElement.data("columnId", this.element.data("columnId"));
        blockElement.data("layoutId", this.element.data("layoutId"));
        this.element.append(blockElement);
        this.blocks.push(block);
        return nextBlockId;
      },

      deleteBlock: function(blockId) {
        if (!this.blocks[blockId]) {
          throw new Error("No block with id " + blockId + " inserted.");
        }
        this.blocks[blockId].element.remove();
        this.blocks.splice(blockId, 1);
      },

      getBlock: function(blockId) {
        return this.blocks[blockId];
      },

      setBlock: function(blockId, block) {
        this.blocks[blockId] = block;
      },

      commitBlocks: function() {
        if (this.getInsertedBlocks().length === 0) {
          throw new Error("No blocks inserted.");
        }
        $.each(this.blocks, function(i, block) {
          block.commit();
        });
      },

      hasBlocks: function() {
        return this.blocks.length > 0;
      },

      getCommittedBlocks: function() {
        return $.grep(this.blocks, function(block) {
          return block.committed;
        });
      },

      getInsertedBlocks: function() {
        return $.grep(this.blocks, function(block) {
          return !block.committed;
        });
      },

      toJSON: function() {
        return { blocks: this.blocks };
      }

    };
  }

  return Column;

});
