suite('Layoutmanager', function() {
  'use strict';

  var Layoutmanager;
  var layoutmanager;
  var Layout;
  var target;

  setup(function(done) {
    require(['app/simplelayout/Layoutmanager', 'app/simplelayout/Layout'], function(_Layoutmanager, _Layout) {
      Layout = _Layout;
      Layoutmanager = _Layoutmanager;
      layoutmanager = new Layoutmanager();
      target = $('<div></div>');
      layoutmanager.attachTo(target);
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Layoutmanager, TypeError, 'Layoutmanager constructor cannot be called as a function.');
  });

  test('default width is 100%', function() {
    var addedNodes = $.map(target.children(), function(e) {
      return [{
        tag: e.tagName,
        classes: e.className,
        style: e.style.cssText
      }];
    });
    assert.deepEqual(addedNodes, [{
      tag: "DIV",
      classes: "sl-simplelayout",
      style: "width: 100%;"
    }]);
  });

  test('can have width of 800px', function() {
    var layoutmanager = new Layoutmanager({
      width: '800px'
    });
    var target = $("<div></div>");

    layoutmanager.attachTo(target);

    var addedNodes = $.map(target.children(), function(e) {
      return [{
        tag: e.tagName,
        classes: e.className,
        style: e.style.cssText
      }];
    });
    assert.deepEqual(addedNodes, [{
      tag: "DIV",
      classes: "sl-simplelayout",
      style: "width: 800px;"
    }]);
  });

  test('can be added to a target node.', function() {
    var addedNodes = $.map(target.children(), function(e) {
      return [{
        tag: e.tagName,
        classes: e.className
      }];
    });
    assert.deepEqual(addedNodes, [{
      tag: "DIV",
      classes: "sl-simplelayout"
    }]);
  });

  suite('Layout-transactions (to get visual feedback where layout will be placed)', function() {

    var layout;
    var target;
    var layoutmanager;

    setup(function(done) {
      layout = new Layout(4);
      layoutmanager = new Layoutmanager();
      target = $("<div></div>");
      layoutmanager.attachTo(target);
      done();
    });

    test('can insert a Layout.', function() {
      layoutmanager.insertLayout(layout);

      var addedNodes = $.map(target.find('.sl-layout'), function(e) {
        return {
          tag: e.tagName,
          classes: e.className
        };
      });
      assert.deepEqual(addedNodes, [{
        tag: "DIV",
        classes: "sl-layout"
      }]);
    });

    test('insert a Layout twice raises an exception.', function() {
      layoutmanager.insertLayout(layout);

      assert.throw(function() {
          layoutmanager.insertLayout(layout);
        },
        Error,
        "Layout already inserted."
      );
    });

    test('can rollback a layout.', function() {
      layoutmanager.insertLayout(layout);
      layoutmanager.rollbackLayout();

      var addedNodes = target.find('.sl-layout');
      assert(addedNodes.length === 0);
    });

    test('rollback a non inserted layout raises an exception', function() {
      assert.throw(function() {
          layoutmanager.rollbackLayout();
        },
        Error,
        'No layout inserted.'
      );
    });
  });

});
