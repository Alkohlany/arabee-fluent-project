
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from 'lucide-react';

// Define the structure for country data
interface CountryData {
  name: string;
  value: number;
  code?: string;
}

interface GeoMapProps {
  data: CountryData[];
  isLoading: boolean;
}

const GeoMap = ({ data, isLoading }: GeoMapProps) => {
  const { t, isRTL } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !mapContainerRef.current) return;

    // Simple representation of a world map with highlighted countries
    const drawMap = () => {
      const container = mapContainerRef.current;
      if (!container) return;
      
      // Clear previous content
      container.innerHTML = '';
      
      // Create a div for the map visualization
      const mapDiv = document.createElement('div');
      mapDiv.className = 'h-[320px] w-full relative bg-slate-700 rounded-lg overflow-hidden';
      
      // Add a simple representation of continents/countries
      const worldMapSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      worldMapSvg.setAttribute('viewBox', '0 0 1000 500');
      worldMapSvg.setAttribute('class', 'w-full h-full');
      
      // Add a simple background
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('width', '1000');
      background.setAttribute('height', '500');
      background.setAttribute('fill', '#475569');
      worldMapSvg.appendChild(background);
      
      // For each country data, create a visual indicator
      data.forEach(country => {
        // Position markers randomly on the map for demonstration
        // In a real implementation, you would use actual geographical coordinates
        const x = Math.floor(Math.random() * 900) + 50;
        const y = Math.floor(Math.random() * 400) + 50;
        
        // Create a circle marker for each country
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', Math.min(Math.max(country.value * 2, 5), 20).toString()); // Size based on value
        circle.setAttribute('fill', '#3b82f6');
        circle.setAttribute('opacity', '0.7');
        
        // Create a tooltip on hover
        circle.addEventListener('mouseenter', (e) => {
          const tooltip = document.createElement('div');
          tooltip.className = 'absolute bg-white p-2 rounded shadow-md z-50';
          tooltip.style.left = `${e.clientX}px`;
          tooltip.style.top = `${e.clientY - 40}px`;
          tooltip.innerHTML = `${country.name}: ${country.value}`;
          document.body.appendChild(tooltip);
          
          circle.addEventListener('mouseleave', () => {
            document.body.removeChild(tooltip);
          });
        });
        
        worldMapSvg.appendChild(circle);
        
        // Add country name
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x.toString());
        text.setAttribute('y', (y - 10).toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '10');
        text.textContent = country.name;
        worldMapSvg.appendChild(text);
      });
      
      mapDiv.appendChild(worldMapSvg);
      container.appendChild(mapDiv);
    };
    
    drawMap();
  }, [data, isLoading]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <MapPin className="h-5 w-5 text-blue-500" />
          {t("usersCountry") || "Users' Country"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[320px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div ref={mapContainerRef} className="h-[320px] w-full">
            {/* Map will be rendered here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeoMap;
