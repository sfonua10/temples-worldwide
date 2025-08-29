import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import './App.css'
import templesData from './data/temples.json'
import type { Temple } from './types/temple'
import { TempleInfoPanel } from './components/TempleInfoPanel'
import { AccessibilitySettings } from './components/AccessibilitySettings'

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

function App() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false)
  const hoveredTempleIdRef = useRef<string | null>(null)
  const selectedTempleIdRef = useRef<string | null>(null)
  const allTemples = useRef<Temple[]>([])
  const currentTempleIndex = useRef<number>(-1)


  const selectTemple = (temple: Temple, index: number) => {
    // Update feature state for previously selected temple
    if (selectedTempleIdRef.current && map.current) {
      map.current.setFeatureState(
        { source: 'temples', id: selectedTempleIdRef.current },
        { selected: false }
      )
    }
    
    // Update feature state for newly selected temple
    if (map.current) {
      map.current.setFeatureState(
        { source: 'temples', id: temple.id },
        { selected: true }
      )
    }
    
    // Update refs and state
    selectedTempleIdRef.current = temple.id.toString()
    currentTempleIndex.current = index
    setSelectedTemple(temple)
    setShowDetailModal(true)
    
    // Fly to temple location
    if (map.current) {
      map.current.flyTo({
        center: [temple.location.coordinates.lng, temple.location.coordinates.lat],
        zoom: 4,
        duration: 2000
      })
    }
  }

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't interfere if modal is open
      if (showDetailModal) return
      
      switch (e.key.toLowerCase()) {
        case 'a':
          if (!showAccessibilitySettings) {
            e.preventDefault()
            setShowAccessibilitySettings(true)
          }
          break
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [showDetailModal, showAccessibilitySettings])

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      projection: 'globe', // Display the map as a globe
      zoom: 3,
      center: [0, 20],
      minZoom: 1,
      maxZoom: 5
    })

    // The following values can be changed to control rotation speed:
    const secondsPerRevolution = 120 // Rotation speed
    const maxSpinZoom = 5 // Max zoom level to spin
    const slowSpinZoom = 3 // Zoom level to start slowing down spin

    let userInteracting = false
    const spinEnabled = true

    function spinGlobe() {
      const zoom = map.current!.getZoom()
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution
        if (zoom > slowSpinZoom) {
          // Slow spinning at higher zooms
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom)
          distancePerSecond *= zoomDif
        }
        const center = map.current!.getCenter()
        center.lng -= distancePerSecond / 60 // Divide by 60 for frame rate
        map.current!.easeTo({ center, duration: 1, easing: (t) => t })
      }
    }

    // Pause spinning on user interaction
    map.current.on('mousedown', () => {
      userInteracting = true
    })

    // Resume spinning when user is done interacting
    map.current.on('mouseup', () => {
      userInteracting = false
      spinGlobe()
    })

    // Resume spinning on touch end
    map.current.on('touchend', () => {
      userInteracting = false
      spinGlobe()
    })


    // Add map click handler to deselect temples
    map.current.on('click', (e) => {
      // Check if click was on empty space (not on a temple)
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ['temple-layer']
      })
      
      if (features.length === 0 && selectedTempleIdRef.current) {
        // Clear selected state on the map
        map.current!.setFeatureState(
          { source: 'temples', id: selectedTempleIdRef.current },
          { selected: false }
        )
        selectedTempleIdRef.current = null
        setSelectedTemple(null)
      }
    })

    // Start spinning
    map.current.on('load', () => {
      // Set the globe's atmosphere
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map.current as any).setFog({
        color: 'rgb(186, 210, 235)', // Lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        'space-color': 'rgb(11, 11, 25)', // Background color
        'star-intensity': 0.6 // Background star brightness (default 0.35 at low zooms)
      })

      // Prepare temple data as GeoJSON
      const temples = templesData as Temple[]
      const templesWithCoordinates = temples.filter(temple => 
        temple.location.coordinates.lat !== 0.0 && temple.location.coordinates.lng !== 0.0
      )
      
      // Store temples for navigation
      allTemples.current = templesWithCoordinates
      
      const geojsonData = {
        type: 'FeatureCollection' as const,
        features: templesWithCoordinates.map(temple => ({
          type: 'Feature' as const,
          id: temple.id, // This is crucial for feature state to work
          properties: temple,
          geometry: {
            type: 'Point' as const,
            coordinates: [temple.location.coordinates.lng, temple.location.coordinates.lat]
          }
        }))
      }

      // Add temples as a source
      map.current!.addSource('temples', {
        type: 'geojson',
        data: geojsonData
      })

      // Add temple layer
      map.current!.addLayer({
        id: 'temple-layer',
        type: 'circle',
        source: 'temples',
        paint: {
          'circle-radius': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            6,
            ['boolean', ['feature-state', 'hover'], false],
            6,
            4
          ],
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#f00',
            ['==', ['get', 'status'], 'Operating'],
            '#4264fb',
            '#C0C0C0'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      })

      // Handle temple clicks
      map.current!.on('click', 'temple-layer', (e) => {
        e.preventDefault()
        const feature = e.features![0]
        const templeData = feature.properties as Temple
        
        // Find temple index in our array
        const templeIndex = allTemples.current.findIndex(t => t.id === templeData.id)
        
        if (templeIndex !== -1) {
          selectTemple(allTemples.current[templeIndex], templeIndex)
        }
      })

      // Handle hover effects
      map.current!.on('mouseenter', 'temple-layer', (e) => {
        map.current!.getCanvas().style.cursor = 'pointer'
        const feature = e.features![0]
        const templeId = feature.properties!.id
        
        // Clear previous hover state
        if (hoveredTempleIdRef.current && hoveredTempleIdRef.current !== templeId) {
          map.current!.setFeatureState(
            { source: 'temples', id: hoveredTempleIdRef.current },
            { hover: false }
          )
        }
        
        // Set new hover state
        hoveredTempleIdRef.current = templeId
        map.current!.setFeatureState(
          { source: 'temples', id: templeId },
          { hover: true }
        )
      })

      map.current!.on('mouseleave', 'temple-layer', () => {
        map.current!.getCanvas().style.cursor = ''
        if (hoveredTempleIdRef.current) {
          map.current!.setFeatureState(
            { source: 'temples', id: hoveredTempleIdRef.current },
            { hover: false }
          )
          hoveredTempleIdRef.current = null
        }
      })

      // Start spinning animation
      const animationFrame = () => {
        spinGlobe()
        requestAnimationFrame(animationFrame)
      }
      animationFrame()
    })

    // Clean up on unmount
    return () => {
      map.current?.remove()
    }
  }, [])



  return (
    <>
      <div ref={mapContainer} className="map-container" />
      
      {/* Accessibility Settings Button */}
      <button 
        className="accessibility-button"
        onClick={() => setShowAccessibilitySettings(true)}
        aria-label="Open accessibility settings"
        title="Accessibility Settings (A)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
        </svg>
      </button>
      
      {/* Enhanced side panel */}
      <TempleInfoPanel 
        temple={selectedTemple}
        onClose={() => {
          // Clear selected state when closing panel
          if (selectedTempleIdRef.current && map.current) {
            map.current.setFeatureState(
              { source: 'temples', id: selectedTempleIdRef.current },
              { selected: false }
            )
            selectedTempleIdRef.current = null
          }
          setSelectedTemple(null)
          setShowDetailModal(false)
        }} 
      />
      
      {/* Accessibility Settings */}
      <AccessibilitySettings
        isOpen={showAccessibilitySettings}
        onClose={() => setShowAccessibilitySettings(false)}
      />
    </>
  )
}

export default App