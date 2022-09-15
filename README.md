## Added **Bandcamp Search**

Example:

```js 
client.manager.search({
   source: "bandcamp",
   query: "eminem"
});
```

## Installation

**NPM** :
```sh
npm install Tomato6966/erela.js-bandcamp-search
```

**Yarn** :
```sh
yarn add Tomato6966/erela.js-bandcamp-search
```

## Example Usage

```javascript
const { Manager } = require("erela.js");
const Deezer  = require("erela.js-deezer");

const manager = new Manager({
  plugins: [
    // Initiate the plugin
    new Deezer()
  ]
});

manager.search("https://www.deezer.com/track/1174602992");
```
