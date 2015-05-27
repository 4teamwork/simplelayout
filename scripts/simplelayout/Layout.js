define(["simplelayout/Column"], function(Column) {

  "use strict";

  function Layout(columns) {
    if (!(this instanceof Layout)) {
      throw new TypeError("Layout constructor cannot be called as a function.");
    }
    if (!columns) {
      throw new TypeError("Columns are not defined.");
    }

    var template = $.templates("<div class='sl-layout'></div>");

    return {

      committed: false,

      columns: {},

      toolbar: null,

      create: function(id, container) {
        this.element = $(template.render());
        this.element.data("layoutId", id);
        this.element.data("container", container);
        for (var i = 0; i < columns; i++) {
          var column = new Column(columns);
          this.columns[i] = column;
          var columnElement = column.create();
          columnElement.data("columnId", i);
          columnElement.data("layoutId", id);
          columnElement.data("container", container);
          this.element.append(columnElement);
        }
        return this.element;
      },

      commit: function() { this.committed = true; },

      insertBlock: function(columnId, content, type) { return this.columns[columnId].insertBlock(content, type); },

      deleteBlock: function(columnId, blockId) { this.columns[columnId].deleteBlock(blockId); },

      commitBlocks: function(columnId) { this.columns[columnId].commitBlocks(); },

      attachToolbar: function(toolbar) {
        this.toolbar = toolbar;
        this.element.append(toolbar.element);
      },

      getCommittedBlocks: function() {
        var committedBlocks = [];
        for(var key in this.columns) {
          committedBlocks = $.merge(this.columns[key].getCommittedBlocks(), committedBlocks);
        }
        return committedBlocks;
      },

      getInsertedBlocks: function() {
        var insertedBlocks = [];
        for(var key in this.columns) {
          insertedBlocks = $.merge(this.columns[key].getInsertedBlocks(), insertedBlocks);
        }
        return insertedBlocks;
      },

      hasBlocks: function() {
        var hasBlocks = false;
        $.each(this.columns, function(columnIdx, column) {
          if(column.hasBlocks()) {
            hasBlocks = true;
            return false;
          }
        });
        return hasBlocks;
      },

      toJSON: function() { return { columns: this.columns }; },

      toObject: function(columnsToCreate) {
        var self = this;
        $.each(columnsToCreate, function(idx, column) {
          self.columns[idx].toObject(column.blocks);
        });
      }

    };
  }

  return Layout;

});
