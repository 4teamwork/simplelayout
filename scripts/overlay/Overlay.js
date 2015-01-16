define([], function() {

  'use strict';

  function Overlay(_options) {
    if (!(this instanceof Overlay)) {
      throw new TypeError("Overlay constructor cannot be called as a function.");
    }

    var options = $.extend({target : 'body'}, _options || {});

    var template = $.templates('<div class="sl-overlay"><div class="sl-overlay-modal"><div class="sl-overlay-content">{{:content}}</div><span class="sl-overlay-handler"><i class="icon-close"></i></span></div></div>');

    var target = $(options.target);

    var closeHandle;

    var modal;

    return {

      options : options,

      element : null,

      create : function(content) {
        var that = this;
        this.element = $(template.render({content : content}));
        closeHandle = $('.sl-overlay-handler', this.element);
        modal = $('.sl-overlay-modal', this.element);
        target.append(this.element);
        this.element.show();
        var marginLeft = "-" + modal.width() / 2 + 'px';
        var marginTop = "-" + modal.height() / 2 + 'px';
        modal.css('margin-left', marginLeft);
        modal.css('margin-top', marginTop);
        closeHandle.off('click').on('click', function() {that.close.call(that);});
        this.element.hide();
      },

      open : function(content) {
        var that = this;
        var modal;
        if(!this.element) {
          this.create(content);
        }
        this.element.show();
      },

      close : function() {
        if(this.element) {
          this.element.hide();
          closeHandle.off('click');
        }
      },

      content : function(content) {
        if(!this.element) {
          this.create(content);
        }
        $('.sl-overlay-content', this.element).html(content);
      },

      getElement : function() {
        if(!this.element) {
          this.element = $(template.render({content : content}));
          closeHandle = $('.sl-overlay-handler', this.element);
        }
        return this.element;
      }
    };
  }

  return Overlay;

});
