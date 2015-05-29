(function(global) {
  "use strict";

  var Simplelayout = global.Simplelayout;
  var Toolbox = global.Toolbox;

  $(document).ready(function() {
    var simplelayout = new Simplelayout({
      source: ".sl-simplelayout"
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
    simplelayout.getLayoutmanager().deserialize();
    $("#ser").on("click", function() {
      console.log(simplelayout.getLayoutmanager().serialize());
    });
    $("#mark").on("click", function() {
      for(var lkey in simplelayout.getLayoutmanager().layouts) {
        for(var ckey in simplelayout.getLayoutmanager().layouts[lkey].columns){
          for(var bkey in simplelayout.getLayoutmanager().layouts[lkey].columns[ckey].blocks) {
            simplelayout.getLayoutmanager().layouts[lkey].columns[ckey].blocks[bkey].mark();
          }
        }
      }
    });
  });
}(window));
