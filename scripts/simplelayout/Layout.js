define(['jquery', 'app/simplelayout/Block', 'jqueryui/droppable', 'jqueryui/sortable'], function($, Block) {

  'use strict';

  function Layout(columns) {
    if (!(this instanceof Layout)) {
      throw new TypeError("Layout constructor cannot be called as a function.");
    }
    if (!columns) {
      throw new TypeError("columns must be defined");
    }

    return {
      getElement: function() {
        if(this.element) {
          return this.element;
        }
        this.element = $('<div>').addClass('sl-layout');
        var columnWidth = 100 / columns + "%";
        for (var i = 0; i < columns; i++) {
          var column = $('<div>').addClass('sl-column').width(columnWidth);
          this.element.append(column);
        }
        return this.element;
      },

      insertBlockAt : function(options) {
        if(this.transactionOptions) {
          throw new Error('Block already inserted.');
        }
        this.transactionOptions = options;
        var column = this.getElement().children('.sl-column')[options.column];
        if(!column) {
          throw new ReferenceError('Column ' + options.column + ' does not exist');
        }
        $(column).append(options.block.getElement());
      },

      rollbackBlock : function() {
        if(!this.transactionOptions) {
          throw new Error('No block inserted.');
        }
        this.transactionOptions.block.getElement().remove();
        this.transactionOptions = null;
      },

      commitBlock : function() {
        this.transactionOptions = null;
      },

      getColumns : function() {
        return this.getElement().find('.sl-column');
      }

    };
  }

  return Layout;

});
