# Simplelayout

Javascript Library for organising Layouts with drag and drop.

## Dependencies

JQuery 1.6+

jsrender 1.0.0-beta (https://github.com/BorisMoore/jsrender)

JQueryUI 1.11.2 (draggable/droppable/resizable/sortable)

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

  var simplelayout = new Simplelayout();
  var toolbox = new Toolbox({
    layouts: [1, 2, 4]
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
{layouts : []} // --> Array of columns (Default is [])
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

Define initial block height
```javascript
{blockHeight : '50px'} // Default is 100px
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

## Events

layoutInserted(event, layoutId)

layoutDeleted(event)

layoutsCommited(event)

blocksInserted(event, layoutId, column-id, blockId)

blockDeleted(event)

blocksCommitted(event)

blockMoved(event, oldLayoutId, oldColumnId, blockId, newLayoutId, newColumnId)

deserialized(event)

# Overlay

Generate new Overlay
```javascript
var overlay = new Overlay();
```

## Options

Set target selector (Default: 'body')
```javascript
{target : '#overlay'}
```

## API

Creates the overlay, attach event handler for closing, calculate margin for centering.
Will be called as well when opening the overlay.
```javascript
overlay.create();
```

Opens the overlay (alternative set content)
```javascript
overlay.open([content:String]);
```

Closes the overlay
```javascript
overlay.close();
```

Sets the overlays content
```javascript
overlay.content('<p>Test</p>');
```
