const typeLabels = { place: "Place to go", activity: "Thing to do", food: "Food to try", pass: "Worth a pass" };
const typeIcons = { place: "⌂", activity: "◌", food: "✱", pass: "↝" };
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
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const markers = L.layerGroup().addTo(map);
const list = document.querySelector("#recommendation-list");
const search = document.querySelector("#search");
let activeFilter = "all";

function escapeHtml(value = "") {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function locationsFor(item) {
  const direct = item.coordinates ? [{ name: item.title, city: item.city, coordinates: item.coordinates }] : [];
  return [...direct, ...(item.where || []).filter((spot) => spot.coordinates)];
}

function markerIcon(type) {
  return L.divIcon({
    className: "custom-pin-wrap",
    html: `<div class="map-marker ${type}"><span>${typeIcons[type]}</span></div>`,
    iconSize: [34, 34], iconAnchor: [17, 30], popupAnchor: [0, -30],
  });
}

function ratingStars(rating) {
  const value = Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null;
  if (!value) return "";
  return `<span class="rating" aria-label="${value} out of 5 must-go rating" title="${value} out of 5 must-go"><span>Must-go</span><b>${"★".repeat(value)}</b>${"★".repeat(5 - value)}</span>`;
}

function googleMapsUrl(item, location) {
  const destination = location?.coordinates
    ? location.coordinates.join(",")
    : `${location?.name || item.title}, ${location?.city || item.city}, Taiwan`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

function mapsLink(item, location, label = "Directions") {
  return `<a class="maps-link" href="${googleMapsUrl(item, location)}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`;
}

function popup(item, location) {
  const locationLine = location.name === item.title ? "" : `<p class="popup-location">Try it at ${escapeHtml(location.name)} · ${escapeHtml(location.city)}</p>`;
  const where = item.where?.length ? `<div class="popup-where"><b>Where to get it</b>${item.where.map((spot) => `<span>${escapeHtml(spot.name)} · ${escapeHtml(spot.city)} ${mapsLink(item, spot, "Map")}</span>`).join("")}</div>` : "";
  const alternative = item.alternative ? `<div class="popup-alternative"><b>Try this instead</b><span>${escapeHtml(item.alternative)}</span></div>` : "";
  return `<article class="popup"><p class="popup-type">${typeLabels[item.type]}</p><h2>${escapeHtml(item.title)}</h2>${ratingStars(item.rating)}${locationLine}<p>${escapeHtml(item.description || "")}</p>${alternative}${where}${mapsLink(item, location)}</article>`;
}

function matches(item) {
  const query = search.value.trim().toLowerCase();
  const searchable = [item.title, item.city, item.description, ...(item.tags || []), ...(item.where || []).flatMap((spot) => [spot.name, spot.city])].join(" ").toLowerCase();
  return (activeFilter === "all" || item.type === activeFilter) && (!query || searchable.includes(query));
}

function focusItem(item) {
  const location = locationsFor(item)[0];
  map.flyTo(location?.coordinates || cityCoordinates[item.city] || cityCoordinates.Taiwan, location ? 13 : 8, { duration: 0.75 });
}

function render() {
  markers.clearLayers();
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
    actions.innerHTML = mapsLink(item, location, "Open in Google Maps");
    card.append(actions);
    list.append(card);
    locationsFor(item).forEach((location) => {
      L.marker(location.coordinates, { icon: markerIcon(item.type), title: item.title }).bindPopup(popup(item, location), { maxWidth: 260 }).addTo(markers);
    });
  });
}

function updateCounts() {
  document.querySelector("#all-count").textContent = recommendations.length;
  ["place", "activity", "food", "pass"].forEach((type) => {
    document.querySelector(`#${type}-count`).textContent = recommendations.filter((item) => item.type === type).length;
  });
}

document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item === button));
  render();
}));
search.addEventListener("input", render);
document.querySelector("#mobile-toggle").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("is-open"));
updateCounts();
render();
