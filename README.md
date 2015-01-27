# Simplelayout

Javascript Library for organising Layouts with drag and drop.

## Dependencies

JQuery 1.6+

jsrender 1.0.0-beta (https://github.com/BorisMoore/jsrender)

JQueryUI 1.10.2 (draggable/droppable/sortable)

npm 2.0.0

## Install

### Install Node Dependencies
```bash
npm install
```
### Install Bower Dependencies
```bash
bower install
```
### Build

Dev (default):
Does not optimize javascript and CSS files.
Starts grunt watcher.
```bash
grunt
```

Prod:
Optimizes javascript and CSS files for production
```bash
grunt prod
```
## Get started

```javascript
$(document).ready(function() {
  var target = $('body');

  var simplelayout = new Simplelayout({width : '900px'});
  var toolbox = new Toolbox({
    layouts: [1, 2, 4],
    components : components : [{"title": "Listingblock", "description": "can list things", "content_type": "listingblock", "form_url" : "http://www.google.com"},
        {"title": "Textblock", "description": "can show text", "content_type": "textblock", "form_url" : "http://www.bing.com"}]
  });

  simplelayout.attachTo(target);
  toolbox.attachTo(target);
  simplelayout.attachToolbox(toolbox);
});
```

#Toolbox

## Options

Select layouts that can be dragged from the toolbox.
```javascript
{layouts : [1]} // --> Raises exeption when no layouts are defined
```

Select the provided components
```javascript
{components : [{"title": "Listingblock", "description": "can list things", "content_type": "listingblock", "form_url" : "http://www.google.com"},
        {"title": "Textblock", "description": "can show text", "content_type": "textblock", "form_url" : "http://www.bing.com"}]}
```

## API

Attach Element to JQuery Node
```javascript
toolbox.attachTo($('body'));
```

Get JQuery Element
```javascript
toolbox.getElement();
```

#Simplelayout

## Options

Select number of image per column (oriented on biggest layout in toolbox)
```javascript
{imageCount : 1} // Default is 1
```

Define width of layoutmanager
```javascript
{width : '800px'} // Default is 100%
```

## API

Attach Element

Must have been called before attaching a toolbox. Otherwise will raise an exception so the layoutmanager knows his context
```javascript
simplelayout.attachTo($('body'));
```

Get JQuery Element
```javascript
simplelayout.getElement();
```

Attach Toolbox
```javascript
simplelayout.attachToolbox(toolbox);
```

Eventbinding
```javascript
simplelayout.on(eventType, callbackFunction);
```

## Eventtypes

layoutInserted(event, layoutId)

layoutDeleted(event)

layoutsCommited(event)

blocksInserted(event, layoutId, columnId, blockId)

blockDeleted(event)

blocksCommitted(event)

blockMoved(event, oldLayoutId, oldColumnId, blockId, newLayoutId, newColumnId)

deserialized(event)
