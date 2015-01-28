define([], function() {

  'use strict';

  function Toolbox(_options) {

    if (!(this instanceof Toolbox)) {
      throw new TypeError("Toolbox constructor cannot be called as a function.");
    }

    if(!_options || !_options.layouts || _options.layouts.length === 0){
      throw new Error("No layouts defined.");
    }

    var options = _options;

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
            <a class='sl-toolbox-header sl-toolbox-handle'>Toolbox</a> \
            <a class='sl-toolbox-header'>Komponenten</a> \
              {{for components}} \
                <a class='sl-toolbox-component' title='{{:description}}' data-form_url='{{:form_url}}'> \
                  <i class='{{:content_type}}'></i>{{:title}} \
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

    var data = {
      "components" : options.components,
      "layouts": layouts
    };

    var element = $(template.render(data));

    $('.sl-toolbox-component', element).each(function(i, el) {
      $(el).data('actions', options.components[i].actions);
    });

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
