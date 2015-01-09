define([], function() {

  'use strict';

  function Block(type) {

    if (!(this instanceof Block)) {
      throw new TypeError("Block constructor cannot be called as a function.");
    }

    if (!type) {
      throw new ReferenceError("Type must be defined.");
    }

    var template = $.templates("<div data-type='{{:type}}' class='sl-block'>{{:data}}</div>");

    return {

      committed : false,

      type : type,

      getElement: function() {
        return this.element;
      },

      create: function(_data) {
        var that = this;
        var data = {
          'data': _data
        };
        data.type = type;
        this.element = $(template.render(data));
        return this.element;
      }
    };

  }
  return Block;

});
