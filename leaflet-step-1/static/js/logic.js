// usgs endpoint for all earthquakes last 30 days
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

d3.json(queryUrl, data => {
    // console.log(data.features);
    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map

    var gjLayer = L.geoJSON(data.features, { 
      pointToLayer: (feature, latlng) => { return L.circleMarker( latlng, {
        radius: Math.pow(feature.properties.mag, 2),
        fillColor: getColour(feature.properties.mag),
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
      })}
    }).bindPopup( layer => `Magnitude: <b>${layer.feature.properties.mag}</b><br>${layer.feature.properties.place}`);
    

    // Define streetmap and darkmap layers
    var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
        maxZoom: 18,
        bounds: [[-90, -180], [90, 180]],
        noWrap: true,
        id: 'light-v10',
        accessToken: API_KEY
      });

    var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
        maxZoom: 18,
        bounds: [[-90, -180], [90, 180]],
        noWrap: true,
        id: 'dark-v10',
        accessToken: API_KEY
    });

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
  
    // Define a baseMaps and overlay maps hold our layers
    var baseMaps = {
        'Light Map': lightmap,
        'Dark Map': darkmap,
        'Street Map': streetmap
    };
  
    var overLay = {
        'Earthquakes': gjLayer
    };

    var southWest = L.latLng(-90, -185);
    var northEast = L.latLng(90, 185);
    var bounds = L.latLngBounds(southWest, northEast);
    
    // Create a new map
    var myMap = L.map('map', {
        center: [0, 180],
        maxBounds: bounds,
        zoom: 2,
        layers: [lightmap, gjLayer]
    });

    // Create a layer control containing our baseMaps
    L.control.layers(baseMaps, overLay).addTo(myMap);
  

    // Add legend (include CSS from index.html)
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend');
        var limits = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7+'];
        var colors = ['#ff0000', '#ff4e00', '#ff7000', '#ff8c00', '#e8fb43', '#cef761', '#b2f27a', '#90ee90'];
        var labels = [];

        // Add min & max
        div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> <div class="max">' + limits[limits.length - 1] + '</div></div>';
        limits.forEach( (limit, index) => { labels.push('<li style="background-color: ' + colors[index] + '"></li>') });
        div.innerHTML += '<ul>' + labels.join('') + '</ul>';

        console.log(limits);
        console.log(colors);
        console.log(labels);

        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

}); 


function getColour(d) {
return d > 7 ? "#ff0000"
    : d > 6 ? "#ff4e00"
    : d > 5 ? "#ff7000"
    : d > 4 ? "#ff8c00"
    : d > 3 ? "#e8fb43"
    : d > 2 ? "#cef761"
    : d > 1 ? "#b2f27a"
    : "#90ee90";
};