// create tile layer for the backgrounds of the map
var deafaultMap =L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// make a map object
var locationMap = L.map("map",{
    center: [36.7783,-119.4179],
    zoom:3
});

// add default map to the map
deafaultMap.addTo(locationMap);

// variable to hold the earthquake data layer
let earthquakes = new L.layerGroup();

// get the data for the earthquakes and populate the layer group
// call the USGS GeoJson API
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(
    function(earthquakeData){
        // console log to make sure the data loaded
        console.log(earthquakeData);

        // plot dots, where the radius is dependent on the magnitude
        // and color is dependent on depth

        // function that chooses the color of the data point
        function dataColor(depth){
            if (depth > 90)
                return "red";
            else if(depth > 70)
                return "#fa4605";
            else if(depth > 50)
                return "#fa7b05";
            else if(depth > 30)
                return "#fab505";
            else if(depth > 10)
                return "#a0fa05";
            else
                return "green";
        }
        // make a function that determines the size of the radius
        function radiusSize(magnitude){
            if (magnitude == 0)
                return 1; 
            else    
                return magnitude*5; 
        }
        // add the style for each data point
        function dataStyle(feature)
        {
            return{
                opacity: 0.5,
                fillOpacity: 0.5,
                fillColor: dataColor(feature.geometry.coordinates[2]),
                color: "000000", 
                radius: radiusSize(feature.properties.mag),
                weight: 0.5,
                stroke: true

            }
        }

        // add the GeoJson Data to the earthquake layer
        L.geoJson(earthquakeData,{
            // make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // set the style for each marker
            style: dataStyle,
            // add popups
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                  "Magnitude: "
                  + feature.properties.mag
                  + "<br>Depth: "
                  + feature.geometry.coordinates[2]
                  + "<br>Location: "
                  + feature.properties.place
                );
              }
        }).addTo(earthquakes);

         
    }
    
);

// add the earthquake layer to the map
earthquakes.addTo(locationMap);


// add the overlay for the tectonic plates
let overlays = {
    
};

// add the layer control
L.control
    .layers(overlays)
    .addTo(locationMap);



    let colors = [
        "green",
        "#a0fa05",
        "#fab505",
        "#fa7b05",
        "#fa4605",
        "red"
    ];

 // Create a legend to display information about our map
 var legend = L.control({
    position: "bottomright"
       
  });
  
  // When the layer control is added, insert a div with the class of "legend"
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    var depth = [9, 29, 49, 69, 89, 500];
    var labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    div.innerHTML = '<div>Depth (km)</div>';
    for (var i = 0; i < depth.length; i++){
      div.innerHTML += '<i style="background:' + colors[i] + '">&nbsp;&nbsp;&nbsp;&nbsp;</i>&nbsp;'+
                      labels[i] + '<br>';
    }
    return div;
  };
  // Add the legend to the map
  legend.addTo(locationMap);


