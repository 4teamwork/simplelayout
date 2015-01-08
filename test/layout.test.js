suite('Layout', function() {
  'use strict';

  var Layout;
  var Block;

  setup(function(done) {
    require(['app/simplelayout/Layout', 'app/simplelayout/Block'], function(_Layout, _Block) {
      Layout = _Layout;
      Block = _Block;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Layout, TypeError, 'Layout constructor cannot be called as a function.');
  });

  suite('column width calculation', function() {

    test('4-columns layout has width of 25%', function() {
      var layout = new Layout(4);
      layout.create();

      var columns = layout.getColumns();

      var nodes = $.map(columns, function(column) {
        return $.map(column.getElement(), function(el) {
          return {tag : el.tagName, classes : el.className, id : $(el).data('column-id')};
        });
      });

      assert.deepEqual(nodes, [
        {tag: "DIV", classes: "sl-column", id : 0},
        {tag: "DIV", classes: "sl-column", id : 1},
        {tag: "DIV", classes: "sl-column", id : 2},
        {tag: "DIV", classes: "sl-column", id : 3}
      ]);

    });

    test('4-columns layout has full-width', function() {
      var layout = new Layout(1);
      layout.create();

      var columns = layout.getElement().find('.sl-column');

      columns = $.map(columns, function(el) {
        return {tag: el.tagName, classes: el.className, id : $(el).data('column-id')};
      });

      assert.deepEqual(columns, [{tag: "DIV", classes: "sl-column", id : 0}]);

    });
  });

});
