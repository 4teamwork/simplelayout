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
          $.extend(columnElement.data(), { columnId: i, layoutId: id, container: container });
          this.element.append(columnElement);
        }
        return this.element;
      },

      insertBlock: function(columnId, content, type) { return this.columns[columnId].insertBlock({ content: content, type: type }); },

      deleteBlock: function(columnId, blockId) { this.columns[columnId].deleteBlock(blockId); },

      attachToolbar: function(toolbar) {
        this.toolbar = toolbar;
        this.element.append(toolbar.element);
      },

      getBlocks: function() {
        var blocks = [];
        $.each(this.columns, function(columnIdx, column) {
          $.each(column.blocks, function(blockIdx, block) {
            blocks.push(block);
          });
        });
        return blocks;
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

      deserialize: function() {
        var self = this;
        $(".sl-column", this.element).each(function(idx, e) {
          e = $(e);
          var column = self.columns[idx];
          var data = column.element.data();
          var stylingClass = column.element.attr("class");
          column.element = e;
          column.element.attr("class", stylingClass);
          $.extend(column.element.data(), data);
          column.deserialize();
        });
      }

    };
  }

  return Layout;

});
