mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10', // stylesheet location
    center: airport.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// Create a new marker.
new mapboxgl.Marker()
    .setLngLat(airport.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5>${airport.name}</h5><p>${airport.location}</p>`
            )
    )
    .addTo(map)