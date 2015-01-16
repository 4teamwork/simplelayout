suite('Overlay', function() {
  'use strict';

  var Overlay;

  setup(function(done) {
    require(['overlay/Overlay'], function(_Overlay) {
      Overlay = _Overlay;
      done();
    });
  });

  test('is a constructor function', function() {
    assert.throw(Overlay, TypeError, 'Overlay constructor cannot be called as a function.');
  });

  test('can apply a target', function() {
    var overlay = new Overlay({target : 'body'});
    assert.equal(overlay.options.target, 'body');
  });

  test('default target is body', function() {
    var overlay = new Overlay();
    assert.equal(overlay.options.target, 'body');
  });

  test('can create', function() {
    var target = $('<div id="target"></div>');
    $('body').append(target);
    var overlay = new Overlay({target : '#target'});

    overlay.create();
    var overlayNode = $.map(target[0].childNodes,function(e){ return {tag : e.tagName, classes : e.className}; });
    var modalNode = $.map(target[0].childNodes[0].childNodes,function(e){ return {tag : e.tagName, classes : e.className}; });
    var contentNode = $.map(target[0].childNodes[0].childNodes[0].childNodes,function(e){ return {tag : e.tagName, classes : e.className}; });
    assert.deepEqual(overlayNode, [{tag:'DIV', classes:'sl-overlay'}]);
    assert.deepEqual(modalNode, [{tag:'DIV', classes:'sl-overlay-modal'}]);
    assert.deepEqual(contentNode, [{tag:'DIV', classes:'sl-overlay-content'}, {tag:'SPAN', classes:'sl-overlay-handler'}]);
  });

  test('can open', function() {
    var target = $('#target');
    target.empty();
    var overlay = new Overlay({target : '#target'});

    overlay.open();
    assert.equal($('#target .sl-overlay').css('display'), 'block');
  });

  test('can open with specific HTML', function() {
    var target = $('#target');
    target.empty();
    var content = '<p>test</p>';
    var overlay = new Overlay({target : '#target'});

    overlay.open(content);
    var nodes = $('#target').find('.sl-overlay .sl-overlay-content').html();
    assert.equal(nodes, '<p>test</p>');
  });

  test('can close', function() {
    var target = $('#target');
    target.empty();
    var overlay = new Overlay({target : '#target'});
    overlay.open();
    overlay.close();
    var nodes = $('#target').find('.sl-overlay');
    assert.equal(nodes.css('display'), 'none');
  });

  test('can close by click', function() {
    var target = $('#target');
    target.empty();
    var overlay = new Overlay({target : '#target'});
    overlay.open();
    $('#target').find('.sl-overlay-handler').click();
    var nodes = $('#target').find('.sl-overlay');
    assert.equal(nodes.css('display'), 'none');
  });

  test('can switch content', function() {
    var target = $('#target');
    target.empty();
    var overlay = new Overlay({target : '#target'});
    overlay.open('<p></p>');
    var nodes = $('#target').find('.sl-overlay .sl-overlay-content').html();
    assert.equal(nodes, '<p></p>');
    overlay.content('<span></span>');
    nodes = $('#target').find('.sl-overlay .sl-overlay-content').html();
    assert.equal(nodes, '<span></span>');
  });

});
