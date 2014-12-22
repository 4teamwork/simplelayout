define(['jquery', 'renderer'], function($) {

  'use strict';

  var tmplHelper = {},

    getTemplate = function(name) {
      if (!name) {
        throw "InvalidArgumentException: " + name;
      }
      var deferred = $.Deferred();
      if ($.templates[name]) {
        deferred.resolve();
      } else {
        $.getScript('http://localhost:8080/scripts/templates/' + name + '.js').then(function() {
          deferred.resolve();
        });
      }
      return deferred.promise();
    };

  tmplHelper.getTemplate = getTemplate;

  return tmplHelper;

});
