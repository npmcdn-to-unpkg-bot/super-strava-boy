let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.508235, lng: -0.324592},
        zoom: 8,
    });

    fetch('679046175.json')
        .then(x => x.json())
        .then(x => makeGeoJson(x.stream))
        .then(geoJson => map.data.addGeoJson(geoJson));
}

function makeGeoJson(stream) {
    return {
        type: "Feature",
        properties: {
            color: "blue",
        },
        geometry: {
            type: "LineString",
            coordinates: stream.map(s => [s.point.lng, s.point.lat]),
        }
    };
}
