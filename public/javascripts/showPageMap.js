mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10', // stylesheet location
    center: airport.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
// Create a new marker.
const el = document.createElement('div');
const width = 30;
const height = 30;
el.style.backgroundImage = `url(/images/airport.svg)`;
el.style.width = `${width}px`;
el.style.height = `${height}px`;
el.style.backgroundSize = '100%';
new mapboxgl.Marker(el)
    .setLngLat(airport.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5>${airport.name}</h5><p>${airport.location}</p>`
            )
    )
    .addTo(map)