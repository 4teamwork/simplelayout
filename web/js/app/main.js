define(["app/simplelayout/Simplelayout", "app/toolbox/Toolbox", "EventEmitter", "jquery", "jqueryui", "jsrender"], function(Simplelayout, Toolbox, EE) {
  $(document).ready(function() {
    var toolbox = new Toolbox({
      layouts: [1, 2, 4],
      components: {
        listingblock: {
          title: "Listingblock",
          description: "can list things",
          contentType: "listingblock",
          formUrl: "http://www.google.com",
          actions: {
            edit: {
              class: "edit",
              description: "Edit this block"
            }
          }
        },
        textblock: {
          title: "Textblock",
          description: "can show text",
          contentType: "textblock",
          formUrl: "http://www.bing.com",
          actions: {
            edit: {
              class: "edit",
              description: "Edit this block"
            },
            move: {
              class: "move",
              description: "Move this block"
            }
          }
        }
      }
    });

    toolbox.attachTo($("body"));
    var simplelayout = new Simplelayout({toolbox: toolbox});
    simplelayout.deserialize();
  });
});