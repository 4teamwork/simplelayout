# Simplelayout

Javascript Library for creating Plone-Layouts.

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

Select provided layouts
```javascript
{layouts : []} // --> Array of columns
```

## API

Attach Element
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
{imageCount : 1}
```

## API

Attach Element
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
