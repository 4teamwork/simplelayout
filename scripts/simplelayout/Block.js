define([], function() {

  'use strict';

  function Block(content, type) {

    if (!(this instanceof Block)) {
      throw new TypeError("Block constructor cannot be called as a function.");
    }

    var template = $.templates(
      "<div data-type='{{:type}}' class='sl-block'><div class='sl-block-content'>{{:content}}</div></div>"
    );

    return {

      committed : false,

      uid : null,

      toolbar : null,

      type : type,

      getElement: function() {
        return this.element;
      },

      create: function() {
        var that = this;
        var data = {
          'content': content,
          'type' : type
        };
        this.element = $(template.render(data));
        return this.element;
      },

      content : function(content) {
        $('.sl-block-content', this.element).html(content);
      },

      attachToolbar : function(toolbar) {
        this.toolbar = toolbar;
        this.element.append(toolbar.getElement());
      },

      getToolbar : function() {
        return this.toolbar;
      },

      toJSON : function() {
        return {uid : this.uid, type : type};
      }
    };

  }
  return Block;

});
