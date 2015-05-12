define(["simplelayout/Block"], function(Block) {

  "use strict";

  function Column(column) {
    if (!(this instanceof Column)) {
      throw new TypeError("Column constructor cannot be called as a function.");
    }

    if (!column) { throw new Error("Columns are not defined."); }

    var template = $.templates("<div class='sl-column sl-col-{{:column}}''></div>");

    return {

      blocks: {},

      element: null,

      create: function() {
        this.element = $(template.render({ column: column }));
        return this.element;
      },

      insertBlock: function(content, type) {
        var nextBlockId = Object.keys(this.blocks).length;
        var block = new Block(content, type);
        var blockElement = block.create();
        blockElement.data("blockId", nextBlockId);
        blockElement.data("columnId", this.element.data("columnId"));
        blockElement.data("layoutId", this.element.data("layoutId"));
        this.blocks[nextBlockId] = block;
        return nextBlockId;
      },

      deleteBlock: function(blockId) {
        if (!this.blocks[blockId]) {
          throw new Error("No block with id " + blockId + " inserted.");
        }
        this.blocks[blockId].element.remove();
        delete this.blocks[blockId];
      },

      commitBlocks: function() {
        if (Object.keys(this.getCommittedBlocks()).length === Object.keys(this.blocks).length) {
          throw new Error("No blocks inserted.");
        }
        for (var key in this.blocks) {
          this.blocks[key].committed = true;
        }
      },

      hasBlocks: function() {
        return Object.keys(this.blocks).length > 0;
      },

      getCommittedBlocks: function() {
        var committedBlocks = [];
        for (var key in this.blocks) {
          if (this.blocks[key].committed) {
            committedBlocks.push(this.blocks[key]);
          }
        }
        return committedBlocks;
      },

      getInsertedBlocks: function() {
        var insertedBlocks = [];
        for (var key in this.blocks) {
          if (!this.blocks[key].committed) {
            insertedBlocks.push(this.blocks[key]);
          }
        }
        return insertedBlocks;
      },

      toJSON: function() {
        return { blocks: this.blocks };
      }

    };
  }

  return Column;

});
