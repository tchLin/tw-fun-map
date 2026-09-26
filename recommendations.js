/* Add recommendations here. Use type: "place", "activity", "food", or "pass".
   coordinates are [latitude, longitude] and are optional for city-only ideas.
   Food stays list-only; use its "where" array to give venue or chain options.
   For a chain, use mapsQuery and nearest: true to give friends a “Find nearby” link.
   Use rating: 1–5 to mark how must-go a positive recommendation is.
   A "pass" can include an "alternative" with a kinder suggestion. */
const recommendations = [
  {
    id: "taipei-101",
    type: "place",
    title: "Taipei 101",
    city: "Taipei",
    coordinates: [25.0339, 121.5645],
    description: "Start here while you build your own Taiwan guide.",
    rating: 5,
    tags: ["view", "landmark"],
    thingsToDo: [
      { title: "Take in the observatory view", note: "Best on a clear day." },
      { title: "Browse the design shops downstairs" },
    ],
  },
  {
    id: "taipei-night-market",
    type: "activity",
    title: "Spend an evening at a night market",
    city: "Taipei",
    coordinates: [25.0878, 121.525],
    description: "An example of an activity tied to a city.",
    rating: 4,
    tags: ["evening", "local life"],
  },
  {
    id: "boba",
    type: "food",
    title: "Bubble tea",
    city: "Taiwan",
    description: "A food recommendation can be broad and list places to get it.",
    rating: 5,
    tags: ["drink", "sweet"],
    where: [
      { name: "Add a favorite boba shop", city: "Taipei", coordinates: [25.0478, 121.517] },
      { name: "Add a boba chain", city: "Taiwan", mapsQuery: "Boba chain Taiwan", nearest: true },
    ],
  },
  {
    id: "example-pass",
    type: "pass",
    title: "An example: a tourist trap",
    city: "Taipei",
    description: "Use this category for a friendly heads-up, not a harsh review.",
    alternative: "Your favorite quieter neighborhood or better alternative",
    tags: ["good to know"],
  },
];
