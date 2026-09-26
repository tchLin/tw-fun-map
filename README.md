# Taiwan, recommended

A no-build, static map that can be hosted on GitHub Pages. It uses Leaflet and OpenStreetMap tiles loaded from CDNs, so there is nothing to install or compile.

## Add recommendations

Open `recommendations.js` and add objects to the `recommendations` array. There are three supported types:

```js
{
  id: "unique-id",
  type: "place", // "place", "activity", or "food"
  title: "A great place",
  city: "Hualien",
  coordinates: [23.9911, 121.6112], // latitude, longitude; optional
  description: "Why it is worth a visit.",
  tags: ["nature", "day trip"],
}
```

For food, add `where` to list venues. Each venue with coordinates appears as an extra map pin:

```js
{
  id: "beef-noodle-soup",
  type: "food",
  title: "Beef noodle soup",
  city: "Taipei",
  description: "Comfort food for a rainy afternoon.",
  tags: ["noodles"],
  where: [
    { name: "Your favorite shop", city: "Taipei", coordinates: [25.04, 121.51] },
  ],
}
```

For an idea associated only with a city, omit `coordinates`. It will stay in the filtered list and zoom to the city when selected.

## Publish on GitHub Pages

1. Create a GitHub repository and push these files to its default branch.
2. In the repository, open **Settings → Pages**.
3. Set **Build and deployment** to “Deploy from a branch,” choose the default branch and `/ (root)`, then save.
4. GitHub will show the public URL within a minute or two.

To preview locally, open `index.html` in a browser. A small static server (for example `npx serve .`) is another option.
