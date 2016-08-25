const pubStravaToken = "57a2e0bbc8a2789e2a56cb2f911d76d6ce48b5e5";

const cross = "https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_close_black_16px.svg"

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.508235, lng: -0.324592},
    zoom: 16,
  });

  fetchCommutes("to_work")
    .then(x => x.map(j => j.id))
    .then(ids => {
      for (const id of ids) {
        fetchActivity(id).then(x => {
          new google.maps.Marker({
            position: x.stream[0].point,
            map: map,
            icon: cross,
          });
        });
      }
    });

  fetchCommutes("from_work")
    .then(x => x.map(j => j.id))
    .then(ids => {
      for (const id of ids) {
        fetchActivity(id).then(x => {
          new google.maps.Marker({
            position: x.stream[x.stream.length-1].point,
            map: map,
            icon: cross,
          });
        });
      }
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                google.maps.drawing.OverlayType.CIRCLE]
            },
            circleOptions: {
                fillColor: '#ffff00',
                fillOpacity: 0.3,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            }
        });
        drawingManager.setMap(map);




  // fetch('679046175.json')
  //     .then(x => x.json())
  //     .then(x => makeGeoJson(x.stream))
  //     .then(geoJson => map.data.addGeoJson(geoJson));

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
  const p = fetch("activities200.json")
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

function fetchActivity(id) {
  return fetch("https://nene.strava.com/flyby/stream_compare/" + id + "/" + id)
    .then(x => x.json())
}