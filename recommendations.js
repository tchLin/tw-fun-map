/*
  Add recommendations here. Use type: "place" or "food".
  coordinates are [latitude, longitude]. Use rating: 1–5 for your personal
  must-go score; leave it out when you have not decided yet.
*/
const recommendations = [
  // Taipei
  {
    id: "sun-yat-sen-memorial-hall", type: "place", title: "Sun Yat-sen Memorial Hall 國父紀念館", city: "Taipei", coordinates: [25.0403, 121.5603],
    description: "A landmark hall and park with a classic Taipei 101 view.", rating: 3, tags: ["landmark", "history", "park"],
  },
  {
    id: "dadaocheng", type: "place", title: "Dadaocheng 大稻埕", city: "Taipei", coordinates: [25.056, 121.5104],
    description: "Old Taipei storefronts, riverfront wandering, and a slower pace.", rating: 5, tags: ["historic", "riverfront", "walk"],
  },
  {
    id: "songshan-cultural-park", type: "place", title: "Songshan Cultural and Creative Park 松菸", city: "Taipei", coordinates: [25.0441, 121.5601],
    description: "A former tobacco factory turned into a creative park.", rating: 4, tags: ["design", "art", "shops"],
  },
  {
    id: "xinyi-district", type: "place", title: "Xinyi District 信義", city: "Taipei", coordinates: [25.0338, 121.564],
    description: "Taipei’s polished shopping, dining, and skyline district.", rating: 4, tags: ["shopping", "city", "night"],
  },
  {
    id: "tamsui", type: "place", title: "Tamsui 淡水", city: "New Taipei", coordinates: [25.1677, 121.445],
    description: "A waterfront day trip at the northern end of the MRT Red Line.", rating: 3, tags: ["waterfront", "sunset", "day trip"],
  },
  {
    id: "jiufen", type: "place", title: "Jiufen 九份", city: "New Taipei", coordinates: [25.1098, 121.8455],
    description: "A hillside former mining town with narrow lanes and sea views.", rating: 5, tags: ["mountain", "old street", "day trip"],
  },
  {
    id: "dihua-street", type: "place", title: "Dihua Street 迪化街", city: "Taipei", coordinates: [25.0553, 121.5107],
    description: "A historic shopping street for tea, dried goods, fabric, and gifts.", tags: ["historic", "shopping", "walk"],
  },
  {
    id: "ximending", type: "place", title: "Ximending 西門町", city: "Taipei", coordinates: [25.0422, 121.5082],
    description: "A busy pedestrian district for youth culture, shopping, and late nights.", tags: ["shopping", "night", "city"],
  },
  {
    id: "dongmen", type: "place", title: "Dongmen 東門", city: "Taipei", coordinates: [25.0338, 121.5291],
    description: "A central neighborhood known for Yongkang Street and good eating.", tags: ["food", "walk", "neighborhood"],
  },
  {
    id: "taipei-101", type: "place", title: "Taipei 101 台北 101", city: "Taipei", coordinates: [25.0339, 121.5645],
    description: "The signature skyline stop in the middle of Xinyi.", tags: ["view", "landmark", "shopping"],
  },

  // Kaohsiung
  {
    id: "pier-2", type: "place", title: "Pier-2 Art Center 駁二藝術特區", city: "Kaohsiung", coordinates: [22.6197, 120.2814],
    description: "Repurposed harbor warehouses with art, shops, and open-air space.", tags: ["art", "waterfront", "shops"],
  },
  {
    id: "lotus-pond", type: "place", title: "Lotus Pond 蓮池潭", city: "Kaohsiung", coordinates: [22.6854, 120.2956],
    description: "A scenic pond ringed by temples and distinctive landmarks.", tags: ["temple", "waterfront", "sightseeing"],
  },
  {
    id: "shoushan", type: "place", title: "Shoushan 柴山", city: "Kaohsiung", coordinates: [22.6541, 120.2634],
    description: "A forested hill and nature escape beside the city.", tags: ["hike", "nature", "view"],
  },
  {
    id: "sizihwan", type: "place", title: "Sizihwan 西子灣", city: "Kaohsiung", coordinates: [22.6247, 120.2655],
    description: "A harbor-side beach area best known for its sunset.", tags: ["beach", "sunset", "waterfront"],
  },
  {
    id: "ruifeng-night-market", type: "place", title: "Ruifeng Night Market 瑞豐夜市", city: "Kaohsiung", coordinates: [22.6661, 120.2998],
    description: "A lively evening market with snacks, games, and local crowds.", tags: ["night market", "food", "night"],
  },
  {
    id: "kaohsiung-museum-fine-arts-park", type: "place", title: "Kaohsiung Museum of Fine Arts Park 美術館公園", city: "Kaohsiung", coordinates: [22.6527, 120.2868],
    description: "A spacious museum-and-park area for a slower afternoon.", tags: ["art", "park", "relaxed"],
  },
];
