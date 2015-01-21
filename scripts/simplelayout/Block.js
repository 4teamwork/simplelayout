define([], function() {

  'use strict';

  function Block(height, content) {

    if (!(this instanceof Block)) {
      throw new TypeError("Block constructor cannot be called as a function.");
    }

    var template = $.templates("<div class='sl-block'><div class='sl-block-content'>{{:data}}</div></div>");

    if(!height) {
      height = 'auto';
    }

    return {

      committed : false,

      height : height,

      uid : null,

      getElement: function() {
        return this.element;
      },

      create: function() {
        var that = this;
        var data = {
          'data': content
        };
        this.element = $(template.render(data)).height(this.height);
        return this.element;
      },

      content : function(content) {
        $('.sl-block-content', this.element).html(content);
      },

      toJSON : function() {
        return {height : this.height, uid : this.uid};
      }
    };

  }
  return Block;

});
