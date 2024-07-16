var map = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
        }).addTo(map);

        const geojsonAPI = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

        d3.json(geojsonAPI).then(function(data) {
            data.features.forEach(function(feature) {
                var magnitude = feature.properties.mag;
                var depth = feature.geometry.coordinates[2];
                var location = feature.properties.place;

                var circle = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                    radius: magnitude * 2, // Scale marker size based on magnitude
                    fillColor: getColor(depth), // Assign color based on depth
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map);

                circle.bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Location:</b> ${location}<br><b>Depth:</b> ${depth} km`);
            });

            // Legend
            var legend = L.control({ position: 'bottomright' });
            legend.onAdd = function(map) {
                var div = L.DomUtil.create('div', 'info legend');
                div.innerHTML = '<h4>Depth Legend</h4>' +
                    '<p><span style="background: darkred; border-radius: 50%;"></span> 90+ km</p>' +
                    '<p><span style="background: orangered; border-radius: 50%;"></span> 70-90 km</p>' +
                    '<p><span style="background: orange; border-radius: 50%;"></span> 50-70 km</p>' +
                    '<p><span style="background: yellow; border-radius: 50%;"></span> 30-50 km</p>' +
                    '<p><span style="background: lawngreen; border-radius: 50%;"></span> 10-30 km</p>' +
                    '<p><span style="background: green; border-radius: 50%;"></span> -10-10 km</p>';
                return div;
            };
            legend.addTo(map);
        }).catch(function(error) {
            console.error('Error fetching GeoJSON data:', error);
        });

        function getColor(depth) {
            return depth > 90 ? 'darkred' :
                   depth > 70 ? 'orangered' :
                   depth > 50 ? 'orange' :
                   depth > 30 ? 'yellow':
                   depth > 10 ? 'lawngreen':
                   'green';
        }