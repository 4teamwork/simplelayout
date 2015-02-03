define([], function() {

  "use strict";

  function Toolbox(_options) {

    if (!(this instanceof Toolbox)) {
      throw new TypeError("Toolbox constructor cannot be called as a function.");
    }

    if (!_options || !_options.layouts || _options.layouts.length === 0) {
      throw new Error("No layouts defined.");
    }

    var options = $.extend({
      components: {}
    }, _options || {});

    var layouts = [];
    $.each(options.layouts, function(i, el) {
      layouts.push({
        columns: el
      });
    });

    var minImageCount = 100 / Math.max.apply(null, options.layouts) / options.imageCount;

    var template = $.templates(
      /*eslint no-multi-str: 0 */
      "<div id='sl-toolbox' class='sl-toolbox'> \
          <div class='components'> \
            <a class='sl-toolbox-header sl-toolbox-handle'>Toolbox</a> \
            <a class='sl-toolbox-header'>Komponenten</a> \
              {{for components}} \
                <a class='sl-toolbox-component' title='{{:description}}' data-type={{:contentType}} data-form_url='{{:formUrl}}'> \
                  <i class='icon-{{:contentType}}'></i>{{:title}} \
                </a> \
              {{/for}} \
            <a class='sl-toolbox-header'>Layout</a> \
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
    var components = [];
    $.each(options.components, function(key, value) {
      components.push(value);
    });

    var data = {
      "components": components,
      "layouts": layouts
    };

    var element = $(template.render(data));

    $(".sl-toolbox-component", element).each(function(i, el) {
      $(el).data("actions", options.components[$(el).data("type")].actions);
    });

    return {

      options: options,

      element: element,

      attachTo: function(target) {
        target.append(element);
      },

      getMinImageWidth: function() {
        return minImageCount;
      }

    };

  }
  return Toolbox;

});
