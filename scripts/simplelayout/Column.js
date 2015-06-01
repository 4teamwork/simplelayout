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

      insertBlock: function(blockOptions) {
        blockOptions = $.extend({
          type: "",
          content: ""
        }, blockOptions || {});
        var nextBlockId = Object.keys(this.blocks).length;
        var block = new Block(blockOptions.content, blockOptions.type);
        var blockElement = block.create();
        blockElement.data("blockId", nextBlockId);
        $.extend(blockElement.data(), this.element.data());
        if(blockOptions.source) {
          var data = $.extend(block.element.data(), $(blockOptions.source).data());
          block.element = $(blockOptions.source);
          $.extend(block.element.data(), data);
          block.type = block.element.data("type");
        }
        this.blocks[nextBlockId] = block;
        this.element.trigger("blockInserted", [this, block]);
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

      deserialize: function() {
        var self = this;
        $(".sl-block", this.element).each(function(idx, e) {
          self.insertBlock({ source: e });
        });
      },

      toJSON: function() { return { blocks: this.blocks }; }

    };
  }

  return Column;

});
