define([], function() {

  'use strict';

  function Toolbox(_options) {

    if (!(this instanceof Toolbox)) {
      throw new TypeError("Toolbox constructor cannot be called as a function.");
    }

    var options = $.extend({
      layouts: []
    }, _options || {});

    var layouts = [];
    $.each(options.layouts, function(i, el) {
      layouts.push({
        columns: el
      });
    });

    var minImageCount = 100 / Math.max.apply(null, options.layouts) / options.imageCount;

    var template = $.templates(
      "<div id='sl-toolbox' class='sl-toolbox'> \
          <div class='components'> \
            <a class='sl-header'>Komponenten</a> \
              {{for blocks}} \
                <a class='sl-toolbox-component' data-type='{{:type}}'> \
                  <i class='{{:icon}}'></i>{{:title}} \
                </a> \
              {{/for}} \
            <a class='sl-header'>Layout</a> \
              {{for layouts}} \
                <a class='sl-toolbox-layout' data-columns='{{:columns}}'> \
                  <i class='icon-layout'></i>{{:columns}} - Spalten Layout \
                </a> \
               {{/for}} \
          </div> \
          <div class='sl-toolbox-trash'> \
            <i class='icon-trash'></i> \
          </div> \
        </div>");

    var components = {
      "blocks": [{
        "type": "listingblock",
        "title": "Listingblock",
        "icon": "icon-listing-block"
      }, {
        "type": "textblock",
        "title": "Textblock",
        "icon": "icon-text-block"
      }],
      "layouts": layouts
    };

    var element = $(template.render(components));

    return {

      options : options,

      attachTo: function(target) {
        target.append(element);
      },

      getMinImageWidth : function() {
        return minImageCount;
      },

      getElement : function() {
        return element;
      }

    };

  }
  return Toolbox;

});
