suite("Toolbar", function() {
  "use strict";

  var Toolbar;

  setup(function(done) {
    require(["simplelayout/Toolbar"], function(_Toolbar) {
      Toolbar = _Toolbar;
      done();
    });
  });

  test("is a constructor function", function() {
    assert.throw(Toolbar, TypeError, "Toolbar constructor cannot be called as a function.");
  });

  test("default action is move", function() {
    var toolbar = new Toolbar();
    var actionNodes = $.map(toolbar.element.find("a"), function(action) {
      return {tagName: action.tagName, classes: action.className, title: action.title};
    });

    assert.deepEqual(actionNodes, [{tagName: "A", classes: "move icon-move", title: "Move this block arround"}]);
  });

  test("can add a edit action", function() {
    var toolbar = new Toolbar({edit: {name: "edit", description: "Can edit this block"}});
    var actionNodes = $.map(toolbar.element.find("a"), function(action) {
      return {tagName: action.tagName, classes: action.className, title: action.title};
    });

    assert.deepEqual(actionNodes, [{tagName: "A", classes: "move icon-move", title: "Move this block arround"}, {tagName: "A", classes: "edit icon-edit", title: "Can edit this block"}]);
  });

});
