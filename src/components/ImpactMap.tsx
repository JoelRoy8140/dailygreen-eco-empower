
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Earth, Trees, Droplet, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

// OpenLayers imports
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';

// Impact action types
type ActionType = 'tree-planting' | 'water-conservation' | 'renewable-energy' | 'community-cleanup';

// Map marker data structure
interface ImpactMarker {
  id: string;
  type: ActionType;
  lat: number;
  lng: number;
  title: string;
  description: string;
  impact: {
    co2: number;
    water: number;
  };
  date: string;
  participants: number;
}

// Define initial mock data
const initialMarkers: ImpactMarker[] = [
  {
    id: 'marker-1',
    type: 'tree-planting',
    lat: 40.7128,
    lng: -74.006,
    title: 'Central Park Tree Planting',
    description: 'Community tree planting event with 50 new native trees',
    impact: { co2: 25.0, water: 0 },
    date: '2023-04-15',
    participants: 35,
  },
  {
    id: 'marker-2',
    type: 'water-conservation',
    lat: 34.0522,
    lng: -118.2437,
    title: 'LA River Cleanup',
    description: 'Removed plastic waste and restored riverbank',
    impact: { co2: 5.0, water: 15000 },
    date: '2023-03-22',
    participants: 120,
  },
  {
    id: 'marker-3',
    type: 'renewable-energy',
    lat: 51.5074,
    lng: -0.1278,
    title: 'London Solar Initiative',
    description: 'New community solar installation',
    impact: { co2: 75.0, water: 0 },
    date: '2023-05-01',
    participants: 12,
  },
  {
    id: 'marker-4',
    type: 'community-cleanup',
    lat: 37.7749,
    lng: -122.4194,
    title: 'San Francisco Beach Cleanup',
    description: 'Removed 500kg of plastic waste',
    impact: { co2: 12.0, water: 0 },
    date: '2023-02-18',
    participants: 85,
  },
  {
    id: 'marker-5',
    type: 'tree-planting',
    lat: -33.8688,
    lng: 151.2093,
    title: 'Sydney Urban Forest',
    description: 'Creating green spaces with native plants',
    impact: { co2: 18.0, water: 0 },
    date: '2023-04-30',
    participants: 45,
  },
];

export function ImpactMap() {
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const popupContainer = useRef<HTMLDivElement>(null);
  const popupOverlay = useRef<Overlay | null>(null);
  const [markers, setMarkers] = useState<ImpactMarker[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [mapLoaded, setMapLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [selectedMarker, setSelectedMarker] = useState<ImpactMarker | null>(null);
  
  // Total impact calculation
  const totalImpact = markers.reduce(
    (acc, marker) => {
      acc.co2 += marker.impact.co2;
      acc.water += marker.impact.water;
      acc.events += 1;
      acc.participants += marker.participants;
      return acc;
    },
    { co2: 0, water: 0, events: 0, participants: 0 }
  );
  
  // Apply filter to markers
  const filteredMarkers = selectedType === 'all' 
    ? markers 
    : markers.filter(marker => marker.type === selectedType);
    
  // Get color for marker type
  const getMarkerColor = (type: ActionType) => {
    switch(type) {
      case 'tree-planting': return '#4ade80'; // green
      case 'water-conservation': return '#3b82f6'; // blue
      case 'renewable-energy': return '#facc15'; // yellow
      case 'community-cleanup': return '#f97316'; // orange
      default: return '#9b87f5'; // purple
    }
  };
  
  // Get icon for marker type
  const getMarkerIcon = (type: ActionType) => {
    switch(type) {
      case 'tree-planting': return <Trees className="h-4 w-4" />;
      case 'water-conservation': return <Droplet className="h-4 w-4" />;
      case 'renewable-energy': return <Wind className="h-4 w-4" />;
      case 'community-cleanup': return <Earth className="h-4 w-4" />;
      default: return <Earth className="h-4 w-4" />;
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  useEffect(() => {
    // Load initial markers
    setMarkers(initialMarkers);
  }, []);
  
  // Create vector style for markers
  const createMarkerStyle = (type: ActionType) => {
    const color = getMarkerColor(type);
    return new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({ color }),
        stroke: new Stroke({
          color: '#ffffff',
          width: 2
        })
      })
    });
  };
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    try {
      // Create popup overlay
      if (popupContainer.current) {
        popupOverlay.current = new Overlay({
          element: popupContainer.current,
          autoPan: true,
          positioning: 'bottom-center',
          offset: [0, -10],
        });
      }
      
      // Create map instance
      const mapInstance = new Map({
        target: mapContainer.current,
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: fromLonLat([0, 30]),
          zoom: 2,
          constrainOnlyCenter: true
        }),
        controls: []
      });
      
      map.current = mapInstance;
      
      if (popupOverlay.current) {
        map.current.addOverlay(popupOverlay.current);
      }
      
      // Add markers layer right away
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource
      });
      map.current.addLayer(vectorLayer);
      
      // Force map to render
      setTimeout(() => {
        if (map.current) {
          map.current.updateSize();
        }
        setMapLoaded(true);
      }, 100);
      
      // Add click event to display popup
      map.current.on('click', (evt) => {
        if (!map.current) return;
        
        const feature = map.current.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
        
        if (feature && feature.get('marker')) {
          const marker = feature.get('marker');
          const geometry = feature.getGeometry();
          
          // Check if geometry is a Point geometry with getCoordinates method
          if (geometry && geometry instanceof Point) {
            const coordinate = geometry.getCoordinates();
            
            if (coordinate) {
              setSelectedMarker(marker);
              
              if (popupOverlay.current) {
                popupOverlay.current.setPosition(coordinate);
              }
            }
          }
        } else {
          if (popupOverlay.current) {
            popupOverlay.current.setPosition(undefined);
          }
          setSelectedMarker(null);
        }
      });
      
      // Simplified auto-rotation (disabled for now to troubleshoot basic rendering)
      /*
      const rotateInterval = setInterval(() => {
        if (map.current) {
          const view = map.current.getView();
          const center = view.getCenter();
          if (center) {
            const [x, y] = center;
            view.animate({
              center: [x + 0.5, y],
              duration: 1000
            });
          }
        }
      }, 100);
      */
      
      return () => {
        // Cleanup
        // clearInterval(rotateInterval);
        if (map.current) {
          map.current.setTarget(undefined);
          map.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "Could not initialize map. Please try refreshing the page.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // Add or update markers when filtered markers change
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    try {
      // Create vector source and layer for markers
      const vectorSource = new VectorSource();
      
      // Add filtered markers to vector source
      filteredMarkers.forEach(marker => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([marker.lng, marker.lat]))
        });
        
        feature.setStyle(createMarkerStyle(marker.type));
        feature.set('marker', marker);
        vectorSource.addFeature(feature);
      });
      
      // Remove existing vector layers
      map.current.getLayers().getArray()
        .filter(layer => layer instanceof VectorLayer)
        .forEach(layer => map.current?.removeLayer(layer));
      
      // Add new vector layer with markers
      const vectorLayer = new VectorLayer({
        source: vectorSource
      });
      
      map.current.addLayer(vectorLayer);
      
      // Force map to redraw
      map.current.updateSize();
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  }, [filteredMarkers, mapLoaded]);

  return (
    <Card className="border-sage-200/20 shadow-lg animate-fade-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <Earth className="mr-2 h-6 w-6 text-primary" />
              Impact Map
            </CardTitle>
            <CardDescription>
              Visualize environmental actions around the world
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Impact filters */}
        <div className="mb-4">
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="tree-planting" className="flex-1 flex items-center justify-center">
                <Trees className="h-4 w-4 mr-1" /> Trees
              </TabsTrigger>
              <TabsTrigger value="water-conservation" className="flex-1 flex items-center justify-center">
                <Droplet className="h-4 w-4 mr-1" /> Water
              </TabsTrigger>
              <TabsTrigger value="renewable-energy" className="flex-1 flex items-center justify-center">
                <Wind className="h-4 w-4 mr-1" /> Energy
              </TabsTrigger>
              <TabsTrigger value="community-cleanup" className="flex-1 flex items-center justify-center">
                <Earth className="h-4 w-4 mr-1" /> Cleanup
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Impact summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center p-2">
            <p className="text-xs text-muted-foreground">Events</p>
            <p className="text-lg font-semibold">{filteredMarkers.length}</p>
          </div>
          <div className="text-center p-2">
            <p className="text-xs text-muted-foreground">Participants</p>
            <p className="text-lg font-semibold">
              {filteredMarkers.reduce((sum, m) => sum + m.participants, 0)}
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-xs text-muted-foreground">CO2 Saved</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              {filteredMarkers.reduce((sum, m) => sum + m.impact.co2, 0).toFixed(1)} kg
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-xs text-muted-foreground">Water Saved</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {(filteredMarkers.reduce((sum, m) => sum + m.impact.water, 0) / 1000).toFixed(1)} kL
            </p>
          </div>
        </div>
        
        {/* Map container */}
        <div 
          className={`rounded-lg overflow-hidden border border-border relative ${isMobile ? 'h-[400px]' : 'h-[500px]'}`}
          style={{ position: 'relative', width: '100%' }}
        >
          <div 
            ref={mapContainer} 
            className="w-full h-full" 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
          
          {/* Popup container */}
          <div 
            ref={popupContainer}
            className="absolute bg-white dark:bg-gray-800 p-3 rounded-md shadow-md border border-border max-w-[250px] z-50"
            style={{ display: selectedMarker ? 'block' : 'none' }}
          >
            {selectedMarker && (
              <div>
                <h3 className="font-bold text-sm">{selectedMarker.title}</h3>
                <p className="text-xs mt-1">{selectedMarker.description}</p>
                <div className="text-xs mt-2">
                  <p>{formatDate(selectedMarker.date)} • {selectedMarker.participants} participants</p>
                  {selectedMarker.impact.co2 > 0 && 
                    <p className="text-green-700 dark:text-green-500">CO2 Saved: {selectedMarker.impact.co2} kg</p>
                  }
                  {selectedMarker.impact.water > 0 && 
                    <p className="text-blue-700 dark:text-blue-500">Water Saved: {selectedMarker.impact.water} L</p>
                  }
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-xs w-full"
                  onClick={() => {
                    if (popupOverlay.current) {
                      popupOverlay.current.setPosition(undefined);
                    }
                    setSelectedMarker(null);
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{backgroundColor: getMarkerColor('tree-planting')}} />
            <span className="text-xs text-muted-foreground">Tree Planting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{backgroundColor: getMarkerColor('water-conservation')}} />
            <span className="text-xs text-muted-foreground">Water Conservation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{backgroundColor: getMarkerColor('renewable-energy')}} />
            <span className="text-xs text-muted-foreground">Renewable Energy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{backgroundColor: getMarkerColor('community-cleanup')}} />
            <span className="text-xs text-muted-foreground">Community Cleanup</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
