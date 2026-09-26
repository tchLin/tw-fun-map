# Taiwan, recommended

A no-build, static map that can be hosted on GitHub Pages. It uses Leaflet and OpenStreetMap tiles loaded from CDNs, so there is nothing to install or compile.

## Add recommendations

Open `recommendations.js` and add objects to the `recommendations` array. There are four supported types:

```js
{
  id: "unique-id",
  type: "place", // "place", "activity", "food", or "pass"
  title: "A great place",
  city: "Hualien",
  coordinates: [23.9911, 121.6112], // latitude, longitude; optional
  description: "Why it is worth a visit.",
  rating: 5, // optional: 1–5, from nice-to-have to must-go
  tags: ["nature", "day trip"],
}
```

For food, add `where` to list venues. Food and drink stay in the list rather than adding potentially confusing map pins:

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

For a chain with many branches, use a Google Maps search instead of one coordinate. The card will show a **Find nearby** link, and Google Maps will choose nearby branches using the friend’s own location:

```js
{
  name: "50嵐",
  city: "Taiwan",
  mapsQuery: "50嵐 Taiwan",
  nearest: true,
}
```

Places can include a small list of suggestions for the location itself:

```js
{
  type: "place",
  title: "Taipei 101",
  city: "Taipei",
  thingsToDo: [
    { title: "Visit the observatory", note: "Best on a clear day." },
    { title: "Browse the design shops" },
  ],
}
```

The map has a **Locate me** control. It asks the visitor’s browser for permission only after they click it, then shows an accuracy circle around their reported location.

For an idea associated only with a city, omit `coordinates`. It will stay in the filtered list and zoom to the city when selected.

Every recommendation gets an **Open in Google Maps** link automatically. Coordinates make that link open navigation to the exact point; entries without coordinates search for the title and city instead.

Use `type: "pass"` for a friendly heads-up (the 避雷 list). Include `alternative` when you have a better option to suggest:

```js
{
  id: "example-pass",
  type: "pass",
  title: "An overpriced tourist stop",
  city: "Tainan",
  description: "Fine if you are nearby, but not worth a special trip.",
  alternative: "Go to your favorite local market instead.",
}
```

## Publish on GitHub Pages

1. Create a GitHub repository and push these files to its default branch.
2. In the repository, open **Settings → Pages**.
3. Set **Build and deployment** to “Deploy from a branch,” choose the default branch and `/ (root)`, then save.
4. GitHub will show the public URL within a minute or two.

To preview locally, open `index.html` in a browser. A small static server (for example `npx serve .`) is another option.
