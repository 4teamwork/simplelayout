define([], function() {

  'use strict';

  function Block(content) {

    if (!(this instanceof Block)) {
      throw new TypeError("Block constructor cannot be called as a function.");
    }

    var template = $.templates(
      "<div class='sl-block'> \
        <div class='sl-block-content'> \
          {{:data}} \
        </div> \
      </div>"
    );

    return {

      committed : false,

      uid : null,

      getElement: function() {
        return this.element;
      },

      create: function() {
        var that = this;
        var data = {
          'data': content
        };
        this.element = $(template.render(data));
        return this.element;
      },

      content : function(content) {
        $('.sl-block-content', this.element).html(content);
      },

      toJSON : function() {
        return {uid : this.uid};
      }
    };

  }
  return Block;

});
