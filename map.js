const pubStravaToken = "57a2e0bbc8a2789e2a56cb2f911d76d6ce48b5e5";

let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.508235, lng: -0.324592},
        zoom: 12,
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

function fetchCommutes(direction) {
    headers = new Headers();
    headers.set("Authorization", "Bearer " + pubStravaToken);

    const p = fetch("https://www.strava.com/api/v3/athlete/activities", headers)
        .then(x => x.json())
        
    if (direction === "to_work") {
        // get the morning commutes
        return p.then(acts => acts.filter(a => new Date(a.start_date).getHours() < 12))
    } else if (direction === "from_work") {
        // get the evening commutes
        return p.then(acts => acts.filter(a => new Date(a.start_date).getHours() >= 12))
    }
    return p
}
