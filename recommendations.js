/* Add recommendations here. Use type: "place", "activity", or "food".
   coordinates are [latitude, longitude] and are optional for city-only ideas.
   Food can have a "where" array; venues with coordinates become map pins. */
const recommendations = [
  {
    id: "taipei-101",
    type: "place",
    title: "Taipei 101",
    city: "Taipei",
    coordinates: [25.0339, 121.5645],
    description: "Start here while you build your own Taiwan guide.",
    tags: ["view", "landmark"],
  },
  {
    id: "taipei-night-market",
    type: "activity",
    title: "Spend an evening at a night market",
    city: "Taipei",
    coordinates: [25.0878, 121.525],
    description: "An example of an activity tied to a city.",
    tags: ["evening", "local life"],
  },
  {
    id: "boba",
    type: "food",
    title: "Bubble tea",
    city: "Taiwan",
    description: "A food recommendation can be broad and list places to get it.",
    tags: ["drink", "sweet"],
    where: [{ name: "Add your favorite boba shop", city: "Taipei", coordinates: [25.0478, 121.517] }],
  },
];
