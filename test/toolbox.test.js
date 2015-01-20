suite('Toolbox', function() {
  'use strict';

  var Toolbox;

  setup(function(done) {
    require(['toolbox/Toolbox'], function(_Toolbox) {
      Toolbox = _Toolbox;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Toolbox, TypeError, 'Toolbox constructor cannot be called as a function.');
  });

  test('attaches to target container', function() {
    var toolbox = new Toolbox({layouts : [0]});
    var target = $("<div></div>");

    toolbox.attachTo(target);

    var addedNodes = $.map(target.children(), function(e) {
      return [{tag: e.tagName, id: e.id, classes: e.className}];
    });
    assert.deepEqual(addedNodes, [{tag: "DIV", id: "sl-toolbox", classes: "sl-toolbox"}]);
  });

  suite('components', function() {

    test('has listblock- and textblock components', function() {
      var toolbox = new Toolbox({layouts : [0]});
      var target = $("<div></div>");
      toolbox.attachTo(target);

      var addedNodes = $.map(target.find('.sl-toolbox-component'), function(e) {
        return $(e).data('type');
      });
      assert.deepEqual(addedNodes, ['listingblock', 'textblock']);
    });

    test('raises exception when no layout is defined', function() {
      assert.throws(function(){
        new Toolbox();
      }, Error, "No layouts defined.");
    });

    test('can allow layouts by column count', function() {
      var toolbox = new Toolbox({
        layouts: [1, 2, 4]
      });
      var target = $("<div></div>");

      toolbox.attachTo(target);

      var addedNodes = $.map(target.find('.sl-toolbox-layout'), function(e) {
        return $(e).data('columns');
      });
      assert.deepEqual(addedNodes, [1, 2, 4]);
    });
  });

});
