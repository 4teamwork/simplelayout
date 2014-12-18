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

require(['jquery','app/progress/progress','app/uploader/uploader', 'app/toolbox/toolbox', 'app/simplelayout'], function($, progress, uploader, toolbox, simplelayout){
  $(document).ready(function() {
    var pr = progress.init('#progress');
    var up = uploader.init('#dropzone').on('active', function(){$(this).show();}).on('inactive', function(){$(this).hide();}).on('cancel', function(){$(this).hide();});
    var tb = toolbox.init('#toolbox');
    var sl = simplelayout.init('#simplelayout');
  });
});