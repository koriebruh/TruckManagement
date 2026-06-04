import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { PositionGeo } from '@/hooks/useDelivery';

interface LeafletMapProps {
  positions: PositionGeo[];
  height?: number;
}

const TRUCK_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/3774/3774278.png'; // High quality truck icon

const LeafletMap: React.FC<LeafletMapProps> = ({ positions, height = 300 }) => {
  const htmlContent = useMemo(() => {
    // Sort positions by time to ensure path is drawn correctly
    const sortedPositions = [...positions].sort((a, b) => a.recorded_at - b.recorded_at);
    
    const latestPos = sortedPositions[sortedPositions.length - 1];
    const coordinates = sortedPositions.map(p => `[${p.latitude}, ${p.longitude}]`).join(',');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Leaflet Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
          .truck-marker {
            filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: false,
            attributionControl: false
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          const truckIcon = L.icon({
            iconUrl: '${TRUCK_ICON_URL}',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20],
            className: 'truck-marker'
          });

          const pathPoints = [${coordinates}];
          
          if (pathPoints.length > 0) {
            // Draw travel history
            const polyline = L.polyline(pathPoints, {
              color: '#3b82f6',
              weight: 4,
              opacity: 0.8,
              lineJoin: 'round'
            }).addTo(map);

            // Add truck marker to current position
            const latest = pathPoints[pathPoints.length - 1];
            L.marker(latest, { icon: truckIcon })
              .addTo(map)
              .bindPopup("<b>Unit Truk</b><br>Lokasi Terakhir")
              .openPopup();

            // Fit map to show the whole path
            map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
          } else {
            // Default view if no positions
            map.setView([-6.200000, 106.816666], 13);
          }

          // Add simple zoom control to bottom right
          L.control.zoom({ position: 'bottomright' }).addTo(map);
        </script>
      </body>
      </html>
    `;
  }, [positions]);

  if (!positions || positions.length === 0) {
    return (
      <View style={[styles.container, { height }, styles.centered]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        scrollEnabled={false}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginVertical: 10,
  },
  webview: {
    backgroundColor: 'transparent',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LeafletMap;
