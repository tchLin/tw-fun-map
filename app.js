const typeLabels = { place: "Place to go", food: "Food to try" };
const typeIcons = { place: "⌂", food: "✱" };
const cityCoordinates = {
  Taipei: [25.033, 121.565], Taichung: [24.1477, 120.6736], Tainan: [22.9999, 120.2269],
  Kaohsiung: [22.6273, 120.3014], Hualien: [23.9911, 121.6112], Taiwan: [23.7, 121],
};

const taiwanBounds = L.latLngBounds([21.7, 119.9], [25.4, 122.2]);
const map = L.map("map", {
  zoomControl: false,
  minZoom: 7,
  maxBounds: taiwanBounds.pad(0.2),
  maxBoundsViscosity: 1,
}).fitBounds(taiwanBounds, { padding: [28, 28] });
L.control.zoom({ position: "bottomright" }).addTo(map);
const baseLayers = {
  en: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri",
  }),
  zh: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }),
};
let activeBaseLayer = baseLayers.en.addTo(map);

const markers = L.layerGroup().addTo(map);
const markerByItemId = new Map();
const list = document.querySelector("#recommendation-list");
const search = document.querySelector("#search");
const cityFilter = document.querySelector("#city-filter");
const locateButton = document.querySelector("#locate-me");
const taiwanViewButton = document.querySelector("#taiwan-view");
let activeFilter = "all";
let activeCity = "all";
let userMarker;
let accuracyCircle;

function escapeHtml(value = "") {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function locationsFor(item) {
  if (item.type === "food") return [];
  const direct = item.coordinates && !item.chain ? [{ name: item.title, city: item.city, coordinates: item.coordinates, mapsQuery: item.mapsQuery }] : [];
  const venues = (item.where || []).filter((spot) => spot.coordinates && !spot.chain);
  return [...direct, ...venues];
}

function markerIcon(type) {
  return L.divIcon({
    className: "custom-pin-wrap",
    html: `<div class="map-marker ${type}"><span>${typeIcons[type]}</span></div>`,
    iconSize: [34, 34], iconAnchor: [17, 30], popupAnchor: [0, -30],
  });
}

function easterEggIcon() {
  return L.divIcon({
    className: "custom-pin-wrap",
    html: '<div class="map-marker easter-egg"><span>★</span></div>',
    iconSize: [34, 34], iconAnchor: [17, 30], popupAnchor: [0, -30],
  });
}

function ratingStars(rating) {
  const value = Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null;
  if (!value) return "";
  return `<span class="rating" aria-label="${value} out of 5 must-go rating" title="${value} out of 5 must-go"><span>Must-go</span><b>${"★".repeat(value)}</b>${"★".repeat(5 - value)}</span>`;
}

function googleMapsUrl(item, location) {
  if (location?.mapsQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery)}`;
  }
  const destination = location?.coordinates
    ? location.coordinates.join(",")
    : `${location?.name || item.title}, ${location?.city || item.city}, Taiwan`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

function mapsLink(item, location, label) {
  const action = label || (location?.mapsQuery ? "View in Google Maps" : "Directions");
  return `<a class="maps-link" href="${googleMapsUrl(item, location)}" target="_blank" rel="noopener noreferrer">${action} <span aria-hidden="true">↗</span></a>`;
}

function venueLinks(item) {
  if (item.type !== "food" || !item.where?.length) return "";
  return `<div class="card-venues"><span>Try it at</span><div>${item.where.map((spot) => `<a class="venue-link" href="${googleMapsUrl(item, spot)}" target="_blank" rel="noopener noreferrer">${escapeHtml(spot.name)} <small>${spot.nearest ? "Find nearby" : "Directions"} ↗</small></a>`).join("")}</div></div>`;
}

function popup(item, location) {
  const locationLine = location.name === item.title ? "" : `<p class="popup-location">Try it at ${escapeHtml(location.name)} · ${escapeHtml(location.city)}</p>`;
  const where = item.where?.length ? `<div class="popup-where"><b>Where to get it</b>${item.where.map((spot) => `<span>${escapeHtml(spot.name)} · ${escapeHtml(spot.city)} ${mapsLink(item, spot, spot.nearest ? "Find nearby" : "Map")}</span>`).join("")}</div>` : "";
  return `<article class="popup"><p class="popup-type">${typeLabels[item.type]}</p><h2>${escapeHtml(item.title)}</h2>${ratingStars(item.rating)}${locationLine}<p>${escapeHtml(item.description || "")}</p>${where}${mapsLink(item, location)}</article>`;
}

function matches(item) {
  const query = search.value.trim().toLowerCase();
  const searchable = [item.title, item.city, item.description, ...(item.tags || []), ...(item.where || []).flatMap((spot) => [spot.name, spot.city])].join(" ").toLowerCase();
  return (activeFilter === "all" || item.type === activeFilter) && (activeCity === "all" || item.city === activeCity) && (!query || searchable.includes(query));
}

function focusItem(item) {
  const location = locationsFor(item)[0];
  map.flyTo(location?.coordinates || cityCoordinates[item.city] || cityCoordinates.Taiwan, location ? 13 : 8, { duration: 0.75 });
  if (window.matchMedia("(max-width: 900px)").matches) {
    sidebar.classList.remove("is-open");
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.textContent = "Browse recommendations";
  }
  if (markerByItemId.has(item.id)) {
    window.setTimeout(() => markerByItemId.get(item.id).openPopup(), 500);
  }
}

function render() {
  markers.clearLayers();
  markerByItemId.clear();
  const visible = recommendations.filter(matches);
  list.innerHTML = visible.length ? "" : '<p class="empty">No matches yet. Try a different search.</p>';
  visible.forEach((item) => {
    const card = document.createElement("article");
    card.className = `recommendation-card ${item.type}`;
    const primary = document.createElement("button");
    primary.className = "card-main";
    primary.innerHTML = `<span class="card-icon">${typeIcons[item.type]}</span><span class="card-copy"><small>${typeLabels[item.type]} · ${escapeHtml(item.city)}</small><strong>${escapeHtml(item.title)}</strong>${ratingStars(item.rating)}<em>${escapeHtml(item.description || "Add a note")}</em></span>`;
    primary.addEventListener("click", () => focusItem(item));
    card.append(primary);
    const location = locationsFor(item)[0];
    const actions = document.createElement("div");
    actions.className = "card-actions";
    actions.innerHTML = `${venueLinks(item)}${item.type === "food" && item.where?.length ? "" : mapsLink(item, location, "Open in Google Maps")}`;
    card.append(actions);
    list.append(card);
    locationsFor(item).forEach((location) => {
      const marker = L.marker(location.coordinates, { icon: markerIcon(item.type), title: item.title }).bindPopup(popup(item, location), { maxWidth: 260 }).addTo(markers);
      if (!markerByItemId.has(item.id)) markerByItemId.set(item.id, marker);
    });
  });
  mapEasterEggs.forEach((egg) => {
    L.marker(egg.coordinates, { icon: easterEggIcon(), title: egg.title })
      .bindPopup(`<article class="popup easter-egg-popup"><h2>${escapeHtml(egg.title)}</h2><p>${escapeHtml(egg.message)}</p></article>`, { maxWidth: 220 })
      .addTo(markers);
  });
}

function updateCounts() {
  document.querySelector("#all-count").textContent = recommendations.length;
  ["place", "food"].forEach((type) => {
    document.querySelector(`#${type}-count`).textContent = recommendations.filter((item) => item.type === type).length;
  });
}

document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item === button));
  render();
}));
document.querySelectorAll(".language-switch button").forEach((button) => button.addEventListener("click", () => {
  const nextLayer = baseLayers[button.dataset.language];
  if (nextLayer === activeBaseLayer) return;
  map.removeLayer(activeBaseLayer);
  nextLayer.addTo(map);
  activeBaseLayer = nextLayer;
  document.querySelectorAll(".language-switch button").forEach((item) => item.classList.toggle("is-active", item === button));
}));
search.addEventListener("input", render);
Array.from(new Set(recommendations.map((item) => item.city))).sort().forEach((city) => {
  const option = document.createElement("option");
  option.value = city;
  option.textContent = city;
  cityFilter.append(option);
});
cityFilter.addEventListener("change", () => {
  activeCity = cityFilter.value;
  render();
});
const sidebar = document.querySelector(".sidebar");
const mobileToggle = document.querySelector("#mobile-toggle");
mobileToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("is-open");
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
  mobileToggle.textContent = isOpen ? "View map" : "Browse recommendations";
});

function restoreTaiwanView() {
  map.setMaxBounds(taiwanBounds.pad(0.2));
  map.fitBounds(taiwanBounds, { padding: [28, 28] });
  taiwanViewButton.hidden = true;
}

locateButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    locateButton.textContent = "Location unavailable";
    return;
  }
  locateButton.disabled = true;
  locateButton.textContent = "Finding you…";
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const point = [coords.latitude, coords.longitude];
      if (userMarker) {
        userMarker.setLatLng(point);
        accuracyCircle.setLatLng(point).setRadius(coords.accuracy);
      } else {
        accuracyCircle = L.circle(point, { radius: coords.accuracy, color: "#2585a4", weight: 1, fillColor: "#2585a4", fillOpacity: 0.12, interactive: false }).addTo(map);
        userMarker = L.circleMarker(point, { radius: 8, color: "#fff", weight: 3, fillColor: "#2585a4", fillOpacity: 1 }).bindPopup("You are here").addTo(map);
      }
      if (!taiwanBounds.pad(0.2).contains(point)) {
        map.setMaxBounds(null);
        taiwanViewButton.hidden = false;
      }
      map.flyTo(point, 13, { duration: 0.75 });
      userMarker.openPopup();
      locateButton.disabled = false;
      locateButton.textContent = "⌖ Location shown";
    },
    () => {
      locateButton.disabled = false;
      locateButton.textContent = "Location blocked";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
  );
});
taiwanViewButton.addEventListener("click", restoreTaiwanView);
updateCounts();
render();
