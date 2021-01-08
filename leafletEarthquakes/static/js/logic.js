// usgs endpoint - earthquakes last 30 days
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

// d3 json to get data
d3.json(queryUrl, data => {

  // GeoJSON layer
  var gjLayer = L.geoJSON(data.features, { 
    pointToLayer: (feature, latlng) => { 
      return L.circleMarker( latlng, {
        radius: Math.pow(feature.properties.mag, 2),
        color: 'black',
        weight: 0.5,
        fillColor: getColour(feature.properties.mag),
        fillOpacity: 0.8
      })
    }
  }).bindPopup( layer => `Magnitude: <b>${layer.feature.properties.mag}</b><br>
                ${layer.feature.properties.place}<br>
                ${new Date(layer.feature.properties.time).toUTCString()}`
    );

  // lightmap layer
  var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
    maxZoom: 18,
    bounds: [[-90, -180], [90, 180]],
    noWrap: true,
    id: 'light-v10',
    accessToken: API_KEY
  });

  // darkmap layer
  var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
    maxZoom: 18,
    bounds: [[-90, -180], [90, 180]],
    noWrap: true,
    id: 'dark-v10',
    accessToken: API_KEY
  });

  // streetmap layer
  var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    bounds: [[-90, -180], [90, 180]],
    noWrap: true,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
  });

  // basemaps object to hold all layers
  var baseMaps = {
    'Light Map': lightmap,
    'Dark Map': darkmap,
    'Street Map': streetmap
  };

  // overlay object to hold data layer
  var overLay = {
    'Earthquakes': gjLayer
  };

  // bounding coordinates to prevent map replicating
  var southWest = L.latLng(-90, -185);
  var northEast = L.latLng(90, 185);
  var bounds = L.latLngBounds(southWest, northEast);
  
  // leaflet map
  var myMap = L.map('map', {
    center: [0, 0],
    maxBounds: bounds,
    zoom: 2,
    layers: [lightmap, gjLayer]
  });

  // layer control containing basemaps and overlay
  L.control.layers(baseMaps, overLay).addTo(myMap);

  // legend control
  var legend = L.control({ position: 'bottomright' });

  // legend data and format
  legend.onAdd = function () {
    
    // manipulate DOM to insert div with classes
    var div = L.DomUtil.create('div', 'info legend');
    
    // legend bands
    var limits = [0, 1, 2, 3, 4, 5];

    // create html items in the div
    limits.forEach( (l, i) =>  { 
      div.innerHTML += '<i style=background:' + getColour(l) + '></i> ' + 
      l + 
      (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
    });
    return div;
  };

  // add legend to map
  legend.addTo(myMap);

}); 

// function returns colour code
function getColour(d) {
  return d >= 5 ? "#ff0000" :
         d >= 4 ? "#ff5a00" :
         d >= 3 ? "#ff8300" :
         d >= 2 ? "#dffa4e" :
         d >= 1 ? "#bcf472" :
                  "#90ee90";
};

function timestampToDate (ts) {

// var date = new Date(unix_timestamp * 1000);
// Hours part from the timestamp
var hours = ts.getHours();
// Minutes part from the timestamp
var minutes = "0" + ts.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + ts.getSeconds();

// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

console.log(formattedTime);
return formattedTime
  
 };