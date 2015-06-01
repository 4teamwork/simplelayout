(function(global) {
  "use strict";

  var Simplelayout = global.Simplelayout;
  var Toolbox = global.Toolbox;

  $(document).ready(function() {
    var simplelayout = new Simplelayout();

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
    simplelayout.attachToolbox(toolbox);
    simplelayout.deserialize();
    global.simplelayout = simplelayout;
  });
}(window));
