function map2(){

    // LatLng = Norr, Öst
	var mymap = L.map('mapid').setView([36.075153, 24.867117], 14);

    var imageUrl = 'img/background_map.jpg',
        imageBounds = [[36.045003,24.824002], [36.095303,24.910352]];
    L.imageOverlay(imageUrl, imageBounds).addTo(mymap);

    // 36033029, 24494631
    // 36070000, 24555336

    $.getJSON("data/streets.json",function(data){
        // add GeoJSON layer to the map once the file is loaded
        var myStyle = {
            "color": "#ffbb78",
            "opacity": 0.5
        };
        L.geoJson(data, {style: myStyle}).addTo(mymap);
    });

    d3.csv("data/centroids3.csv", function(poi) {
        poi.forEach(function(p) {
            if (p.classification == 1) { // work
                poi_color = '#d62728';
            }
            else if (p.classification == 2) { // store
                poi_color = '#17becf';
            }
            else if (p.classification == 3) { // home
                poi_color = '#6b6ecf';
            }
            else {
                poi_color = '#e377c2'; // other
            }
            var circle = L.circle([p.lat, p.lng], {
                color: poi_color,
                fillColor: poi_color,
                fillOpacity: 1.0,
                radius: 50
            }).addTo(mymap);
        })
	})

    /*var circle = L.circle([36.0751, 24.8671], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 20
    }).addTo(mymap);
    var circle = L.circle([36.0752, 24.8672], {
        color: 'blue',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 20
    }).addTo(mymap);
    var circle = L.circle([36.0753, 24.8673], {
        color: 'yellow',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 20
    }).addTo(mymap);*/
}