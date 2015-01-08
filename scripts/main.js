require(['requirejs.cnf'], function() {
  require(["app/simplelayout/Simplelayout", "app/toolbox/Toolbox"], function(Simplelayout, Toolbox) {
    $(document).ready(function() {
      var simplelayout = new Simplelayout();
      var toolbox = new Toolbox({layouts : [1,2,4]});
      toolbox.attachTo($('body'));
      simplelayout.attachToolbox(toolbox);
      simplelayout.attachTo($('body'));
    });
  });
});