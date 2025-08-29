import type { Temple } from '../types/temple'
import './InfoCard.css'

interface LocationCardProps {
  temple: Temple
}

export function LocationCard({ temple }: LocationCardProps) {
  return (
    <div className="info-card location-card">
      <div className="card-header">
        <h3>Location & Address</h3>
      </div>
      
      <div className="card-content">
        <div className="location-section">
          <div className="location-item">
            <span className="label">City</span>
            <span className="value">{temple.location.city}</span>
          </div>
          
          <div className="location-item">
            <span className="label">Region</span>
            <span className="value">
              {temple.location.state || temple.location.region || temple.location.province}
            </span>
          </div>
          
          <div className="location-item">
            <span className="label">Country</span>
            <span className="value">{temple.location.country}</span>
          </div>
        </div>
        
        <div className="address-section">
          <span className="label">Full Address</span>
          <p className="address-text">{temple.address}</p>
        </div>
        
        <div className="coordinates-section">
          <span className="label">Coordinates</span>
          <p className="coordinates">
            {temple.location.coordinates.lat.toFixed(6)}, {temple.location.coordinates.lng.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  )
}