(function() {
  "use strict";
  $(document).ready(function() {
    var simplelayout = new Simplelayout({
      width: "900px",
      source: "#simplelayout"
    });

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
              name: "edit",
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
              name: "edit",
              description: "Edit this block"
            },
            download: {
              name: "download",
              description: "Download this content"
            }
          }
        }
      }
    });

    toolbox.attachTo($("body"));
    simplelayout.attachToolbox(toolbox);
    $("#ser").on("click", function() {
      console.log(simplelayout.getLayoutmanager().serialize());
    });
    $("#des").on("click", function() {
      simplelayout.getLayoutmanager().deserialize();
    });
  });
}());
