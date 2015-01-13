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

Builds and concatenates javascript and scss file to dist directory
```bash
grunt build
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
