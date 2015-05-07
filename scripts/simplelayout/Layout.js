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

      create: function(id) {
        this.element = $(template.render());
        this.element.data("layoutId", id);
        for (var i = 0; i < columns; i++) {
          var column = new Column(columns);
          this.columns[i] = column;
          var columnElement = column.create();
          columnElement.data("column-id", i);
          columnElement.data("layout-id", id);
          this.element.append(columnElement);
        }
        return this.element;
      },

      insertBlock: function(columnId, content, type) {
        var column = this.columns[columnId];
        return column.insertBlock(content, type);
      },

      deleteBlock: function(columnId, blockId) {
        var column = this.columns[columnId];
        column.deleteBlock(blockId);
      },

      commitBlocks: function(columnId) {
        this.columns[columnId].commitBlocks();
      },

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

      toJSON: function() {
        return { columns: this.columns };
      }

    };
  }

  return Layout;

});
