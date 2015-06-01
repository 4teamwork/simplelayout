define([], function() {

  "use strict";

  function Block(content, type) {

    if (!(this instanceof Block)) {
      throw new TypeError("Block constructor cannot be called as a function.");
    }

    var template = $.templates(
      '<div data-type="{{:type}}" class="sl-block"><div class="sl-block-content">{{:content}}</div></div>'
    );

    return {

      uid: null,

      toolbar: null,

      type: type,

      element: null,

      create: function() {
        this.element = $(template.render({ "content": content, "type": type }));
        return this.element;
      },

      content: function(toReplace) { $(".sl-block-content", this.element).html(toReplace); },

      attachToolbar: function(toolbar) {
        this.toolbar = toolbar;
        this.element.append(toolbar.element);
      },

      toJSON: function() { return { uid: this.uid, type: this.type }; }
    };

  }
  return Block;

});
