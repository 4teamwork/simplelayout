suite('Simplelayout', function() {
  'use strict';

  var Simplelayout;
  var Toolbox;

  setup(function(done) {
    require(['app/simplelayout/Simplelayout', 'app/toolbox/Toolbox'], function(_Simplelayout, _Toolbox) {
      Simplelayout = _Simplelayout;
      Toolbox = _Toolbox;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Simplelayout, TypeError, 'Simplelayout constructor cannot be called as a function.');
  });

  suite('Integrationtests', function() {

    var simplelayout;
    var toolbox;

    setup(function() {
      simplelayout = new Simplelayout();
      simplelayout.attachTo($('div'));
      toolbox = new Toolbox({'layouts' : [1, 2, 4]});
      toolbox.attachTo($('<div>'));
    });

    test('can attach a toolbox', function() {
      simplelayout.attachToolbox(toolbox);

      assert.isDefined(simplelayout.getToolbox());
    });

    test('has a eventrecorder', function() {
      assert.isDefined(simplelayout.getEventrecorder());
    });

    test('has a layoutmanager', function() {
      assert.isDefined(simplelayout.getLayoutmanager());
    });

  });

});