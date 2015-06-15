# Simplelayout

Javascript Library for organising Layouts with drag and drop.

## Dependencies

JQuery 1.6+

jsrender 1.0.0-beta (https://github.com/BorisMoore/jsrender)

JQueryUI 1.10.2 (draggable/droppable/sortable)

nodejs

## Installation

### Install Node Dependencies
```bash
npm install
```
### Install Bower Dependencies
```bash
bower install
```
### Build Targets

browser-test (default)

Starts up a http-server and opens tests in browser.
```bash
grunt
```

test

Starts up a http-server and runs tests in console with phantomjs
```bash
grunt test
```

dev

Builds and starts a watcher for all sass files.
```bash
grunt dev
```

serve

Starts up a http-server and runs the example application.
```bash
grunt serve
```

lint

Lints all the javascript files.
```bash
grunt lint
```

prod

Lints and builds the application for distribution.
```bash
grunt prod
```
## Getting started

### Toolbox

Provide a toolbox instance for the simplelayout.

```javascript
var toolbox = new Toolbox({
  layouts: [1, 2, 4],
  components: {
    textblock: {
      title: "Textblock",
      description: "Can show some text",
      contentType: "textblock",
      formUrl: "http://www.google.com",
      actions: {
        edit: {
          class="edit",
          description: "Edit this block",
          someCustomAttribute: "someCustomValue"
        },
        move: {
          class: "move",
          description: "Move this block"
        }
      }
    }
  }
});
```

####Componets

| Key | is required | Description |
|---|---|---|
| title | optional | Title in the toolbox |
| description | optional | Used for titleattribute |
|   contentType | required | Represents the type for each block |
| actions | required | Title in the toolbox |

####Actions

| Key | is required | Description |
|---|---|---|
| key | required | Name for the action |
| class | optional | Classattribute for the action |
| description | optional | Used for title attribute |
| custom | optional | Will be provided as data attribute |

### Simplelayout

Use toolbox instance for initializing a simplelayout.

```javascript
var simplelayout = new Simplelayout({toolbox: toolbox});
```

#### Deserialize

Use existing markup for deserializing the simplelayout state.

Provided HTML Structure

```html
<div class="sl-simplelayout" id="slot1">
  <div class="sl-layout">
    <div class="sl-column">
      <div class="sl-block" data-type="textblock">
        <div class="sl-block-content"></div>
      </div>
    </div>
    <div class="sl-column">
      <div class="sl-block" data-type="textblock">
        <div class="sl-block-content"></div>
      </div>
    </div>
    <div class="sl-column">
      <div class="sl-block" data-type="textblock">
        <div class="sl-block-content">
          <p>I am a textblock</p>
        </div>
      </div>
    </div>
    <div class="sl-column"></div>
  </div>
</div>
```


Make sure that each datatype in the structure is covered in the toolbox.

### Events

Attach events using the singleton instance of eventEmitter.

```javascript
var eventEmitter = require("app/simplelayout/EventEmitter");
eventEmitter.on(eventType, callback);
```

#### Eventtypes

blockInserted(block)

blockCommitted(block)

blockMoved(block)

blockDeleted()

layoutInserted(layout)

layoutCommitted(layout)

layoutMoved(newId)

layoutDeleted()

## Testing

Create ``` test/something.test.js ```

Attach file in ``` test/TestRunner.js ``` after the last ```require``` statement.

### Fixtures

Create ``` test/fixtures/fixture.html ```

Use ``` fixtures.load("fixture.html") ```for loading the fixture as an iframe.

Use ``` fixtures.read("fixture.html") ``` for getting the text content from the file.