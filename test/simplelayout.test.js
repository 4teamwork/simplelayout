suite('Simplelayout', function() {
  'use strict';

  var Simplelayout;
  var Toolbox;

  setup(function(done) {
    require(['simplelayout/Simplelayout', 'toolbox/Toolbox'], function(_Simplelayout, _Toolbox) {
      Simplelayout = _Simplelayout;
      Toolbox = _Toolbox;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Simplelayout, TypeError, 'Simplelayout constructor cannot be called as a function.');
  });

  test('default imageCount is 1', function() {
    var simplelayout = new Simplelayout();

    assert.equal(simplelayout.options.imageCount, '1');
  });

  test('can set imageCount to 2', function() {
    var simplelayout = new Simplelayout({imageCount : 2});

    assert.equal(simplelayout.options.imageCount, '2');
  });

  test('image min-width is calculated correctry depending on imageCount and layoutSettings', function() {
    var toolbox = new Toolbox({layouts : [1, 2, 4]});
    var simplelayout = new Simplelayout({imageCount : 1});
    simplelayout.attachToolbox(toolbox);
    assert.equal(simplelayout.getLayoutmanager().minImageWidth, '25');
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

    test('image is rendered depending on toolbox image count', function() {
      var toolbox = new Toolbox({layouts : [1, 2, 4]});
      var simplelayout = new Simplelayout({imageCount : 1});
      simplelayout.attachToolbox(toolbox);

      var layoutId = simplelayout.getLayoutmanager().insertLayout(4);
      simplelayout.getLayoutmanager().insertBlock(layoutId, 0, 'textblock', '<img />');

      assert.equal(simplelayout.getLayoutmanager().getElement().find('img').css('width'), '25%');
    });

  });

});