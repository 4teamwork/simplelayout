suite('Toolbox', function() {
  'use strict';

  var Toolbox;

  setup(function(done) {
    require(['app/toolbox/Toolbox'], function(_Toolbox) {
      Toolbox = _Toolbox;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Toolbox, TypeError, 'Toolbox constructor cannot be called as a function.');
  });

  test('attaches to target container', function() {
    var toolbox = new Toolbox();
    var target = $("<div></div>");

    toolbox.attachTo(target);

    var addedNodes = $.map(target.children(), function(e) {
      return [{
        tag: e.tagName,
        id: e.id,
        classes: e.className
      }];
    });
    assert.deepEqual(addedNodes, [{
      tag: "DIV",
      id: "sl-toolbox",
      classes: "list-group sl-toolbox"
    }]);
  });

  suite('components', function() {

    var toolbox;
    var target;

    setup(function(done) {
      toolbox = new Toolbox();
      target = $("<div></div>");
      toolbox.attachTo(target);
      done();
    });

    test('has listblock- and textblock components', function() {
      var addedNodes = $.map(target.find('.sl-toolbox-component'), function(e) {
        return $(e).data('type');
      });
      assert.deepEqual(addedNodes, ['listingblock', 'textblock']);
    });

    test('has no layouts by default', function() {
      var layoutsTotal = target.find('sl-toolbox-layout').length;
      assert.equal(layoutsTotal, 0);
    });

    test('can have no layouts (page with predefined layouts, only blocks allowed)', function() {
      var toolbox = new Toolbox({
        layouts: []
      });
      var target = $('<div></div>');

      toolbox.attachTo(target);

      var layoutsTotal = target.find('sl-toolbox-layout').length;
      assert.equal(layoutsTotal, 0);
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

  suite('trash', function() {

    var Layoutmanager;
    var Layout;
    var Block;

    setup(function(done) {
      require(['app/simplelayout/Layoutmanager', 'app/simplelayout/Layout', 'app/simplelayout/Block'], function(_Layoutmanager, _Layout, _Block) {
        Layout = _Layout;
        Layoutmanager = _Layoutmanager;
        Block = _Block;
        done();
      });
    });

    test('can delete a block', function() {
      var toolbox = new Toolbox();
      var layoutManagerTarget = $('<div></div>');
      var target = $("<div></div>");
      toolbox.attachTo(target);
      var layoutmanager = new Layoutmanager();
      layoutmanager.attachTo(target);
      var layout = new Layout(4);
      layoutmanager.insertLayout(layout);
      layoutmanager.commitLayout();
      var textblock = new Block('textblock');
      textblock.create('I am a block');
      layout.insertBlockAt({
        block: textblock,
        column: 0
      });
      layout.commitBlock();
      toolbox.deleteComponent(textblock);

      var addedNodes = layoutManagerTarget.find('.sl-block');

      assert(addedNodes.length === 0);
    });

    test('can delete a layout', function() {
      var toolbox = new Toolbox();
      var layoutManagerTarget = $('<div></div>');
      var target = $("<div></div>");
      toolbox.attachTo(target);
      var layoutmanager = new Layoutmanager();
      layoutmanager.attachTo(target);
      var layout = new Layout(4);
      layoutmanager.insertLayout(layout);
      layoutmanager.commitLayout();
      toolbox.deleteComponent(layout);

      var addedNodes = layoutManagerTarget.find('.sl-block');

      assert(addedNodes.length === 0);
    });

    test('deleting non empty layout raises exception', function() {
      var toolbox = new Toolbox();
      var layoutManagerTarget = $('<div></div>');
      var target = $("<div></div>");
      toolbox.attachTo(target);
      var layoutmanager = new Layoutmanager();
      layoutmanager.attachTo(layoutManagerTarget);
      var layout = new Layout(4);
      layoutmanager.insertLayout(layout);
      layoutmanager.commitLayout();
      var textblock = new Block('textblock');
      textblock.create('I am a block');
      layout.insertBlockAt({
        block: textblock,
        column: 0
      });
      layout.commitBlock();

      var addedNodes = layoutManagerTarget.find('.sl-block');

      assert.throw(function() {
        toolbox.deleteComponent(layout);
      }, Error, "Layout is not empty");
    });

  });
});
