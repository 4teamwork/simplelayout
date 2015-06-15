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

    options.layoutActions = {
      move: {
        class: "icon-move move",
        title: "Move this layout arround."
      },
      delete: {
        class: "icon-delete delete",
        title: "Delete this layout."
      }
    };

    var layouts = [];
    $.each(options.layouts, function(i, el) {
      layouts.push({
        columns: el
      });
    });

    var template = $.templates(
      /*eslint no-multi-str: 0 */
      "<div id='sl-toolbox' class='sl-toolbox'> \
          <div class='components'> \
            <div class='addables'> \
              <a class='sl-toolbox-header'>Komponenten</a> \
                <div class='sl-toolbox-components'> \
                  {{for components}} \
                    <a class='sl-toolbox-component' title='{{:description}}' data-type='{{:contentType}}'> \
                      <i class='icon-{{:contentType}}'></i>{{:title}} \
                    </a> \
                  {{/for}} \
                </div> \
              <a class='sl-toolbox-header'>Layout</a> \
                {{for layouts}} \
                  <a class='sl-toolbox-layout' data-columns='{{:columns}}'> \
                    <i class='icon-layout'></i>{{:columns}} - Spalten Layout \
                  </a> \
                 {{/for}} \
            </div> \
            <a class='sl-toolbox-header sl-toolbox-handle'>Toolbox</a> \
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

    $(".sl-toolbox-handle", element).on("click", function() {
      $(".addables").toggleClass("close");
    });

    return {

      options: options,

      element: element,

      disableComponents: function() {
        $(".sl-toolbox-components", this.element).addClass("disabled");
      },

      enableComponents: function() {
        $(".sl-toolbox-components", this.element).removeClass("disabled");
      },

      attachTo: function(target) {
        target.append(element);
      }

    };

  }
  return Toolbox;

});
