define([], function() {

  'use strict';

  function Block(type, height) {

    if (!(this instanceof Block)) {
      throw new TypeError("Block constructor cannot be called as a function.");
    }

    if (!type) {
      throw new ReferenceError("Type must be defined.");
    }

    var template = $.templates("<div data-type='{{:type}}' class='sl-block'><div class='sl-block-content'>{{:data}}</div></div>");

    return {

      committed : false,

      type : type,

      height : height,

      getElement: function() {
        return this.element;
      },

      create: function(_data) {
        var that = this;
        var data = {
          'data': _data
        };
        data.type = type;
        this.element = $(template.render(data)).height(this.height);
        return this.element;
      },

      content : function(content) {
        $('.sl-block-content', this.element).html(content);
      },

      toJSON : function() {
        return {type : this.type, height : this.height};
      }
    };

  }
  return Block;

});
