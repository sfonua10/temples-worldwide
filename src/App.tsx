import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import './App.css'
import templesData from './data/temples.json'
import type { Temple } from './types/temple'
import { TempleInfoPanel } from './components/TempleInfoPanel'

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

function App() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return
    
    const currentMarkers: mapboxgl.Marker[] = []

    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      projection: 'globe', // Display the map as a globe
      zoom: 3.0,
      center: [0, 20]
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

    // Add double-click zoom functionality
    map.current.on('dblclick', (e) => {
      e.preventDefault()
      const currentZoom = map.current!.getZoom()
      map.current!.easeTo({
        zoom: currentZoom + 2,
        duration: 500
      })
    })

    // Add map click handler to deselect temples
    map.current.on('click', () => {
      if (selectedTemple) {
        // Reset all markers to default state
        currentMarkers.forEach(m => {
          const markerEl = m.getElement()
          markerEl.classList.remove('selected')
        })
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

      // Add temple markers
      const temples = templesData as Temple[]
      // Filter temples to only show ones with valid coordinates (not 0,0)
      const templesWithCoordinates = temples.filter(temple => 
        temple.location.coordinates.lat !== 0.0 && temple.location.coordinates.lng !== 0.0
      )
      templesWithCoordinates.forEach((temple: Temple) => {
        // Create custom marker element
        const el = document.createElement('div')
        el.className = `temple-marker ${temple.status === 'Operating' ? 'operating' : 'non-operating'}`
        el.tabIndex = 0
        el.setAttribute('role', 'button')
        el.setAttribute('aria-label', `${temple.name} temple`)

        // Create marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([temple.location.coordinates.lng, temple.location.coordinates.lat])
          .addTo(map.current!)

        // Add click and keyboard handlers
        const handleSelection = (e: Event) => {
          e.stopPropagation()
          
          // Reset other markers
          currentMarkers.forEach(m => {
            const markerEl = m.getElement()
            markerEl.classList.remove('selected')
          })
          
          // Highlight selected marker
          el.classList.add('selected')
          
          setSelectedTemple(temple)
          // Fly to temple location
          map.current!.flyTo({
            center: [temple.location.coordinates.lng, temple.location.coordinates.lat],
            zoom: 8,
            duration: 2000
          })
        }
        
        el.addEventListener('click', handleSelection)
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleSelection(e)
          }
        })

        // Add cursor pointer on hover for map canvas
        el.addEventListener('mouseenter', () => {
          map.current!.getCanvas().style.cursor = 'pointer'
        })

        el.addEventListener('mouseleave', () => {
          map.current!.getCanvas().style.cursor = ''
        })

        currentMarkers.push(marker)
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
      currentMarkers.forEach(marker => marker.remove())
      map.current?.remove()
    }
  }, [])


  return (
    <>
      <div ref={mapContainer} className="map-container" />
      <TempleInfoPanel 
        temple={selectedTemple} 
        onClose={() => setSelectedTemple(null)} 
      />
    </>
  )
}

export default App