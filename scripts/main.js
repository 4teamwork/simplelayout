requirejs.config({
    baseUrl: 'bower_components',
    paths: {
        app: "../scripts",
        jquery : "jquery/dist/jquery",
        jqueryui : "jquery-ui/ui",
        renderer : "jsrender/jsrender",
        packery : "packery/dist/packery.pkgd.min",
        config : "../scripts/config"
    }
});

require(['jquery', 'app/toolbox/toolbox', 'app/simplelayout/Simplelayout'], function($, Toolbox, Simplelayout){
  $(document).ready(function() {
    var toolbox = new Toolbox();
    toolbox.loadComponents('http://localhost:8080/scripts/toolbox/components.json');
    var sl = new Simplelayout('#simplelayout');
    sl.init();
    var sl2 = new Simplelayout('#simplelayout2');
    sl.init();
  });
});