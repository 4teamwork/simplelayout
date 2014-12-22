requirejs.config({
    baseUrl: 'bower_components',
    paths: {
        app: "../scripts",
        jquery : "jquery/dist/jquery",
        jqueryui : "jquery-ui/ui",
        renderer : "jsrender/jsrender",
        packery : "packery/dist/packery.pkgd.min",
        config : "../scripts/config",
        hallo : "../../scripts/hallo"
    }
});

describe('Simplelayout Test', function() {
 it('Should be hallo', function(done) {
   console.log("dinne");
   require([
     'hallo'
   ], function(hallo) {
     chai.assert.equal(hallo.hallo(), "hallo");
     done();
   });
 });
});