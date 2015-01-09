define(['simplelayout/Column'], function(Column) {

  'use strict';

  function Layout(columns) {
    if (!(this instanceof Layout)) {
      throw new TypeError("Layout constructor cannot be called as a function.");
    }
    if (!columns) {
      throw new TypeError("columns must be defined");
    }

    var layoutId = 0;

    var template = $.templates("<div class='sl-layout'></div>");

    return {

      committed : false,

      columns : {},

      getElement: function() {
        return this.element;
      },

      create : function() {
        this.element = $(template.render());
        var columnWidth = 100 / columns + "%";
        for (var i = 0; i < columns; i++) {
          var column = new Column(columnWidth);
          this.columns[i] = column;
          column.create();
          column.getElement().data('column-id', i);
          column.getElement().data('layout-id', layoutId);
          this.element.append(column.getElement());
        }
      },

      getColumns: function() {
        return this.columns;
      },

      insertBlock : function(columnId, blocktype) {
        var column = this.columns[columnId];
        return column.insertBlock(blocktype);
      },

      deleteBlock : function(columnId, blockId) {
        var column = this.columns[columnId];
        column.deleteBlock(blockId);
      },

      commitBlocks : function(columnId) {
        this.getColumns()[columnId].commitBlocks();
      }

    };
  }

  return Layout;

});
