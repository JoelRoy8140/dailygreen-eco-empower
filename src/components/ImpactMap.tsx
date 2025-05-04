
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Earth, Trees, Droplet, Wind, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<ImpactMarker[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [userToken, setUserToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const isMobile = useIsMobile();
  
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
  
  // Check for saved token on component mount
  useEffect(() => {
    // Try to get token from localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setUserToken(savedToken);
      setShowTokenInput(false);
    } else {
      setShowTokenInput(true);
    }
    
    // Load initial markers
    setMarkers(initialMarkers);
  }, []);
  
  // Initialize map whenever the user token changes
  useEffect(() => {
    if (!mapContainer.current || !userToken) return;
    
    // Clear any previous map instance
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    setMapError(null);
    
    try {
      // Set the access token
      mapboxgl.accessToken = userToken;
      
      // Create new map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [0, 30],
        pitch: 40,
      });
      
      // Add controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );
      
      // Add atmosphere and fog effects
      map.current.on('style.load', () => {
        if (!map.current) return;
        
        map.current.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });
        
        // Set the map as loaded
        setMapLoaded(true);
        
        // Add markers after style is loaded
        addMarkersToMap(initialMarkers);
      });
      
      // Error handling
      map.current.on('error', (e) => {
        console.error("Mapbox error:", e);
        setMapError("Failed to initialize map. Please check your Mapbox token.");
        setMapLoaded(false);
        setShowTokenInput(true);
        
        toast({
          title: "Map Error",
          description: "Failed to load map. Please check your Mapbox token.",
          variant: "destructive"
        });
      });
      
      // Auto-rotation settings
      const secondsPerRevolution = 180;
      const maxSpinZoom = 4;
      const slowSpinZoom = 3;
      let userInteracting = false;
      let spinEnabled = true;
      
      // Spin globe function
      function spinGlobe() {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng -= distancePerSecond / 60;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }
      
      // Start spinning
      const spinInterval = setInterval(spinGlobe, 1000);
      
      // Add interaction handlers
      map.current.on('mousedown', () => { userInteracting = true; });
      map.current.on('dragstart', () => { userInteracting = true; });
      map.current.on('moveend', () => { 
        userInteracting = false; 
        spinGlobe();
      });
      map.current.on('touchend', () => { 
        userInteracting = false; 
        spinGlobe();
      });
      
      // Return cleanup function
      return () => {
        clearInterval(spinInterval);
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Could not initialize map. Please check your Mapbox token.");
      setMapLoaded(false);
      setShowTokenInput(true);
      
      toast({
        title: "Map Error",
        description: "Could not initialize map. Please check your Mapbox token.",
        variant: "destructive"
      });
    }
  }, [userToken, toast]);
  
  // Add or update markers when filtered markers change
  useEffect(() => {
    if (mapLoaded && map.current) {
      // Clear existing markers
      const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
      existingMarkers.forEach((marker) => {
        marker.remove();
      });
      
      // Add filtered markers
      addMarkersToMap(filteredMarkers);
    }
  }, [filteredMarkers, mapLoaded]);
  
  // Function to add markers to the map
  const addMarkersToMap = (markerList: ImpactMarker[]) => {
    if (!map.current) return;
    
    markerList.forEach(marker => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'marker-element';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getMarkerColor(marker.type);
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
      el.style.cursor = 'pointer';
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${marker.title}</h3>
            <p class="text-sm">${marker.description}</p>
            <div class="text-xs mt-2">
              <p>${formatDate(marker.date)} • ${marker.participants} participants</p>
              ${marker.impact.co2 > 0 ? `<p class="text-green-700">CO2 Saved: ${marker.impact.co2} kg</p>` : ''}
              ${marker.impact.water > 0 ? `<p class="text-blue-700">Water Saved: ${marker.impact.water} L</p>` : ''}
            </div>
          </div>
        `);
      
      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  };
  
  // Handle token submit
  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      // Save token to local storage
      localStorage.setItem('mapbox_token', tokenInput);
      setUserToken(tokenInput);
      
      toast({
        title: "Token Updated",
        description: "Your Mapbox token has been updated. The map will reload.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid Mapbox token",
        variant: "destructive"
      });
    }
  };

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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTokenInput(!showTokenInput)}
          >
            {showTokenInput ? 'Hide Token Input' : 'API Token'}
          </Button>
        </div>
        
        {showTokenInput && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300">Mapbox Token Required</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  This map requires a Mapbox access token. You can get a free token by creating an account at{" "}
                  <a 
                    href="https://mapbox.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    mapbox.com
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter your Mapbox API token"
                className="flex-1 px-3 py-2 border border-input rounded-md"
              />
              <Button onClick={handleTokenSubmit}>Save</Button>
            </div>
          </div>
        )}
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
        <div className={`rounded-lg overflow-hidden border border-border ${isMobile ? 'h-[400px]' : 'h-[500px]'}`}>
          {!userToken ? (
            <div className="flex items-center justify-center w-full h-full bg-muted">
              <div className="text-center p-4">
                <Earth className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium">Map Requires API Token</h3>
                <p className="text-muted-foreground mb-4">Please enter your Mapbox API token to view the map</p>
                <Button onClick={() => setShowTokenInput(true)}>Enter API Token</Button>
              </div>
            </div>
          ) : mapError ? (
            <div className="flex items-center justify-center w-full h-full bg-muted">
              <div className="text-center p-4">
                <AlertCircle className="mx-auto h-16 w-16 text-destructive opacity-50 mb-4" />
                <h3 className="text-lg font-medium">Map Error</h3>
                <p className="text-muted-foreground mb-4">{mapError}</p>
                <Button onClick={() => setShowTokenInput(true)}>Update API Token</Button>
              </div>
            </div>
          ) : (
            <div ref={mapContainer} className="w-full h-full" />
          )}
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
