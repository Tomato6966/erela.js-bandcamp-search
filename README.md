## Added **Bandcamp Search**

- Search tracks on bandcamp with data and thumbnails
- search bandcamp urls on bandcamp with thumbnails
- if bandcamp is enabled on lavalink, lavalink will play from it!

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
const { Manager } = require("erela.js"); // npm i Tomato6966/erela.js
const BandCampSearch = require("erela.js-bandcamp-search");

client.manager = new Manager({
  plugins: [
    // Initiate the plugin
    new BandCampSearch({
      fetchData: 1, // how many tracks to be fetched on a track result.
      querySource: ["bandcamp", "bc"], // match strings for the source: "string" when it decides to searchon bandcamp
      linksFetchedByLavalink: true, // if you search by link, without the bandcamp source, then it will search via lavalink!
    })
  ]
});
// search urls
client.manager.search("https://dafnez.bandcamp.com/track/serenade", interaction.user);
// search queris
client.manager.search({
   source: "bandcamp",
   query: "eminem"
}, interaction.user);
```

## Information

When doing a search, you don't get the duration data..
only:
- title
- thumbnail
- author
- uri

To get the duration you have to resolve it!

OR you have to increase the option#fetchData
