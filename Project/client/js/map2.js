function map2(poi){

    // LatLng = Norr, Öst
	var mymap = L.map('mapid').setView([36.070153, 24.867117], 14);

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

    var latlngs = [[0,0],  [0, 0]];
    //var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

    poi.forEach(function(p) {
        if (p.classification != 4) {
            if (p.classification == 1) { // work
            poi_color = '#d62728';
            }
            else if (p.classification == 2) { // store
                poi_color = '#17becf';
            }
            else if (p.classification == 3) { // home
                poi_color = '#6b6ecf';
            }
            var circle = L.circle([p.lat, p.lng], {
                color: poi_color,
                fillColor: poi_color,
                fillOpacity: 1.0,
                radius: 60
            }).bindPopup('Place ' + p.name).addTo(mymap);
        }
        else {
            poi_color = '#e377c2'; // other
            var circle = L.circle([p.lng, p.lat], {
                color: poi_color,
                fillColor: poi_color,
                fillOpacity: 1.0,
                radius: 30
            }).bindPopup('Place ' + p.name).addTo(mymap);
        }
    })

    var polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);

    function updateLine(coords) {
        polyline.setLatLngs(coords);
    }
    
    this.setPersonLine = function(seqData, id) {
        lineCoords = [];
        seqData.forEach(function(d) {
            for(var i = 0; i < poi.length; i++) {
                if (d.store == poi[i].name && id == d.person) {
                    if (d.store == "Other") {
                        lineCoords.push([poi[i].lng, poi[i].lat]);
                    }
                    else {
                        lineCoords.push([poi[i].lat, poi[i].lng]);
                    }
                    //lineCoords.push([poi[i].lat, poi[i].lng]);
                    break;
                }
            }
        })
        updateLine(lineCoords);
    }
    //polyline.setLatLngs([[36.045003,24.824002], [36.095303,24.910352], [36.075153, 24.867117]]);

    /*var pointsLayer = L.featureGroup([points])
        .bindPopup('Hello world!')
        .on('click', function() { alert('Clicked on a member of the group!'); })
        .addTo(map);*/


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