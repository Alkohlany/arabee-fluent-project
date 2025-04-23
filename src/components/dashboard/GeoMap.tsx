
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  users: Array<{ Country: string }>;
}

const GeoMap: React.FC<Props> = ({ users }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!mapContainer.current || !users || users.length === 0) return;

    // Initialize map with temporary token - in production, this should be managed through environment variables
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRpOWF2NWowMWZ5MmtvOWFudWJjMXd3In0.Wm7JxKBic-NIrQcS3K7lPw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Count users by country
    const countryCounts: { [key: string]: number } = {};
    users.forEach(user => {
      if (user.Country) {
        countryCounts[user.Country] = (countryCounts[user.Country] || 0) + 1;
      }
    });

    // Clean up
    return () => {
      map.current?.remove();
    };
  }, [users]);

  return (
    <div className="relative h-[400px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default GeoMap;
