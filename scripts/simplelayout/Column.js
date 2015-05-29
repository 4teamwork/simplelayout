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
        blockElement.data("container", this.element.data("container"));
        this.blocks[nextBlockId] = block;
        return block;
      },

      deleteBlock: function(blockId) {
        if (!this.blocks[blockId]) {
          throw new Error("No block with id " + blockId + " inserted.");
        }
        this.blocks[blockId].element.remove();
        delete this.blocks[blockId];
      },

      hasBlocks: function() { return Object.keys(this.blocks).length > 0; },

      toObject: function(blocks) {
        var self = this;
        $.each(blocks, function(idx, block) {
          self.insertBlock(null, block.type);
        });
      },

      toJSON: function() { return { blocks: this.blocks }; }

    };
  }

  return Column;

});
